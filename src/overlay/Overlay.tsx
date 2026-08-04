import { useEffect } from "react";
import ExitButton from "../components/ExitButton";
import CursorFollower from "../components/CursorFollower";

function Overlay({ onExitPress }: { onExitPress: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExitPress();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onExitPress]);

  return (
    <div className="Overlay">
      <ExitButton onExitPress={onExitPress} />
      <CursorFollower />
    </div>
  );
}

export default Overlay;
