import type { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";

type FontPreviewProps = {
  x: number;
  y: number;
  id: number;
  fontFamily: string;
  fontStack: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: string;
  lineHeight: string;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPopups: Dispatch<SetStateAction<any[]>>;
};

function FontPreview({ ...props }: FontPreviewProps) {
  const fontInfo = [
    { label: "Family", value: props.fontStack },
    { label: "Weight", value: props.fontWeight },
    { label: "Style", value: props.fontStyle },
    { label: "Size", value: props.fontSize },
    { label: "Line Height", value: props.lineHeight },
    { label: "Color", value: props.color },
  ];
  return (
    <div
      data-font-preview
      className="font-preview"
      style={{
        position: "fixed",
        top: `${props.y}px`,
        left: `${props.x}px`,
        zIndex: 999999,
      }}
    >
      <div className="font-preview-title">
        <p className="font-title">
          {props.fontFamily} - {props.fontWeight}
        </p>
        <button
          className="font-preview-close-button"
          onClick={(e) => {
            e.stopPropagation();
            props.setPopups((prev) =>
              prev.filter((popup) => popup.id !== props.id),
            );
          }}
        >
          <FaTimes size={20} />
        </button>
      </div>
      <div className="font-preview-details">
        {fontInfo.map(({ label, value }) => (
          <div
            key={label}
            className={`font-preview-item ${label === "Family" ? "family" : ""}`}
          >
            <p className="preview-property">{label}</p>
            <p className="preview-value">{value}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight,
          fontStyle: props.fontStyle,
          fontSize: "26px",
          overflow: "hidden",
        }}
      >
        AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
      </div>
    </div>
  );
}

export default FontPreview;
