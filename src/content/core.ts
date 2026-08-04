/**
 * Closest possible TypeScript port of WhatFont's font detection algorithm.
 * Uses the same canvas pixel-comparison technique (Riobard's method).
 */

type FontWeight = string | number;
type FontStyle = "normal" | "italic" | "oblique" | string;

interface TypeInfoLike {
  fonts: string; // full font-family stack
  weight: FontWeight;
  style: FontStyle;
  size?: string; // e.g. "40px"
}

interface DetectOptions {
  /** Text string used for measurement (default matches original) */
  testText?: string;
  /** Canvas size (default matches original) */
  canvasWidth?: number;
  canvasHeight?: number;
  /** Font size used when drawing (default matches original) */
  fontSize?: string;
}

const DEFAULTS: Required<DetectOptions> = {
  testText: "abcdefghijklmnopqrstuvwxyz",
  canvasWidth: 600,
  canvasHeight: 50,
  fontSize: "40px",
};

/**
 * Draws the test string with the given font declaration and returns pixel data.
 */
function drawText(
  typeInfo: TypeInfoLike,
  options: Required<DetectOptions>,
): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = options.canvasWidth;
  canvas.height = options.canvasHeight;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.textBaseline = "top";

  // Exactly like the original: style + weight + size + family
  ctx.font = `${typeInfo.style} ${typeInfo.weight} ${options.fontSize} ${typeInfo.fonts}`;

  ctx.fillText(options.testText, 0, 0);

  return ctx.getImageData(0, 0, options.canvasWidth, options.canvasHeight).data;
}

/**
 * Byte-for-byte comparison of two pixel buffers (same as original isEqual).
 */
function pixelsEqual(a: Uint8ClampedArray, b: Uint8ClampedArray): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Parse a CSS font-family value into a clean array of family names.
 */
function parseFontStack(fontFamily: string): string[] {
  return fontFamily
    .split(/,\s*/)
    .map((f) => f.replace(/^['"]|['"]$/g, "").trim())
    .filter(Boolean);
}

/**
 * Core detection – closest to original WhatFont.getCurrentFont()
 */
export function detectActualFont(
  elementOrStack: Element | string,
  options: DetectOptions = {},
): string {
  const opts = { ...DEFAULTS, ...options };

  let stack: string[];
  let weight: FontWeight = "400";
  let style: FontStyle = "normal";
  let originalFonts: string;

  if (typeof elementOrStack === "string") {
    // Raw stack string passed
    originalFonts = elementOrStack;
    stack = parseFontStack(elementOrStack);
  } else {
    // DOM element
    const computed = getComputedStyle(elementOrStack);
    originalFonts = computed.fontFamily;
    stack = parseFontStack(originalFonts);
    weight = computed.fontWeight;
    style = computed.fontStyle as FontStyle;
  }

  // 1. Draw the original full stack (reference)
  const originalPixels = drawText(
    { fonts: originalFonts, weight, style },
    opts,
  );

  // 2. Walk the stack exactly like the original
  for (const font of stack) {
    // Create the two test declarations (serif vs sans-serif)
    const typeInfoSerif: TypeInfoLike = {
      fonts: `"${font}", serif`,
      weight,
      style,
    };
    const typeInfoSans: TypeInfoLike = {
      fonts: `"${font}", sans-serif`,
      weight,
      style,
    };

    const pixelsSerif = drawText(typeInfoSerif, opts);
    const pixelsSans = drawText(typeInfoSans, opts);

    // Test A: Does this font exist?
    // (if serif and sans-serif versions look identical → font is available)
    if (!pixelsEqual(pixelsSerif, pixelsSans)) {
      continue; // font not present, browser fell back differently
    }

    // Test B: Does it match the original rendering?
    if (pixelsEqual(pixelsSerif, originalPixels)) {
      return font; // ← found the actual font in use
    }
  }

  // Fallback (same as original): return first font in the stack
  return stack[0] ?? "serif";
}

/**
 * Convenience helper that also returns useful metadata
 */
export function detectFontInfo(element: Element, options?: DetectOptions) {
  const computed = getComputedStyle(element);
  const stack = parseFontStack(computed.fontFamily);
  const actual = detectActualFont(element, options);

  return {
    actual,
    stack,
    weight: computed.fontWeight,
    style: computed.fontStyle,
    size: computed.fontSize,
    lineHeight: computed.lineHeight,
    color: computed.color,
  };
}

// ────────────────────────────────────────────────
// Usage examples
// ────────────────────────────────────────────────

/*
// From a DOM element (most accurate – uses real weight/style)
const el = document.querySelector("h1")!;
console.log(detectActualFont(el));
// → "Segoe UI" | "system-ui" | "-apple-system" | etc.

// From a raw stack string
console.log(
  detectActualFont(
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  )
);

// Full info
console.log(detectFontInfo(el));
*/
