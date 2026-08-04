import { useEffect, useRef, useState } from "react";
import FontPreview from "./FontPreview";
import { detectActualFont } from "../content/core";

type Popup = {
  id: number;
  x: number;
  y: number;
  fontFamily: string;
  fontStack: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: string;
  lineHeight: string;
  color: string;
};
function CursorFollower() {
  const [MousePos, setMousePos] = useState({ mouseX: 0, mouseY: 0 });

  const [popups, setPopups] = useState<Popup[]>([]);
  const [hoveredFontStyles, setHoveredFontStyles] = useState({
    fontFamily: "",
    fontStack: "",
    fontWeight: "",
    fontStyle: "",
    fontSize: "",
    lineHeight: "",
    color: "",
  });

  const hoveredRef = useRef(hoveredFontStyles);
  useEffect(() => {
    hoveredRef.current = hoveredFontStyles;
  }, [hoveredFontStyles]);

  useEffect(() => {
    const POPUP_WIDTH = 470;
    const POPUP_HEIGHT = 300;
    const GAP = 10;

    const followMouse = (e: MouseEvent) => {
      const mouseX = e.clientX + GAP;
      const mouseY = e.clientY + GAP;
      setMousePos({ mouseX, mouseY });

      const hoveredElement = document.elementFromPoint(mouseX, mouseY);
      if (!hoveredElement) return;

      const styles = getComputedStyle(hoveredElement);
      setHoveredFontStyles({
        fontFamily: detectActualFont(hoveredElement),
        fontStack: styles.getPropertyValue("font-family"),
        fontWeight: styles.getPropertyValue("font-weight") || "normal",
        fontStyle: styles.getPropertyValue("font-style") || "normal",
        fontSize: styles.getPropertyValue("font-size"),
        lineHeight: styles.getPropertyValue("line-height"),
        color: styles.getPropertyValue("color"),
      });
    };

    const handleClick = (e: MouseEvent) => {
      const clickedPopup = e
        .composedPath()
        .some(
          (el) =>
            el instanceof HTMLElement && el.classList.contains("font-preview"),
        );
      if (clickedPopup) return;

      let x = e.clientX + GAP;
      let y = e.clientY + GAP;
      if (x + POPUP_WIDTH > window.innerWidth) {
        x = e.clientX - POPUP_WIDTH - GAP;
      }
      if (y + POPUP_HEIGHT > window.innerHeight) {
        y = e.clientY - POPUP_HEIGHT - GAP;
      }
      x = Math.max(GAP, Math.min(x, window.innerWidth - POPUP_WIDTH - GAP));
      y = Math.max(GAP, Math.min(y, window.innerHeight - POPUP_HEIGHT - GAP));

      setPopups((prev) => [
        ...prev,
        { id: Date.now(), x: x, y: y, ...hoveredRef.current },
      ]);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", followMouse);

    return () => {
      window.removeEventListener("mousemove", followMouse);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div
        className="cursor-follower"
        style={{
          position: "fixed",
          top: `${MousePos.mouseY}px`,
          left: `${MousePos.mouseX}px`,
        }}
      >
        <p>{hoveredFontStyles.fontFamily}</p>
      </div>
      {popups.map((popup) => {
        return <FontPreview key={popup.id} {...popup} setPopups={setPopups} />;
      })}
    </>
  );
}

export default CursorFollower;
