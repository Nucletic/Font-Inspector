import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import Overlay from "../overlay/Overlay.tsx";
import styles from "../style.css?inline";

let host: null | HTMLElement = null;
let root: null | Root = null;

export function showOverlay() {
  if (host) return;
  host = document.createElement("div");
  document.body.append(host);

  const shadow = host.attachShadow({ mode: "open" });

  const mountPoint = document.createElement("div");
  mountPoint.id = "ShadowHostBody";

  const style = document.createElement("style");
  style.textContent = styles;
  shadow.appendChild(style);

  shadow.appendChild(mountPoint);
  root = createRoot(mountPoint);
  root.render(<Overlay onExitPress={hideOverlay} />);
}

export function hideOverlay() {
  root?.unmount();
  root = null;

  host?.remove();
  host = null;
}

chrome.runtime.onMessage.addListener((message) => {
  try {
    if (message.action === "showOverlay") {
      showOverlay();
    }
  } catch (error) {
    console.log("Failed to recieve message:", error);
  }
});
