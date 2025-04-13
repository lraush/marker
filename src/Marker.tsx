import React, { useState, useRef } from "react";
import { TextLabel, TextLabelingProps } from "./types";


function Marker({ labels, text, labeling, onChange }: TextLabelingProps) {
  const [activeColor, setActiveColor] = useState<string>(""); 
  const textRef = useRef<HTMLDivElement>(null); 

  
  const handleColorSelect = (color: string) => {
    setActiveColor(color);
  };

  const handleMouseUp = () => {
    if (!activeColor || !textRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    if (!textRef.current.contains(range.commonAncestorContainer)) {
      selection.empty();
      return;
    }

    const textContent = textRef.current.textContent || "";
    const startPos = textContent.indexOf(selectedText);
    const endPos = startPos + selectedText.length;

    const isOverlapping = labeling.some(
      (label) => !(endPos <= label.start || startPos >= label.end)
    );

    if (isOverlapping) {
      selection.empty();
      alert("Выделение пересекается с существующей разметкой");
      return;
    }

    const newLabel: TextLabel = {
      start: startPos,
      end: endPos,
      label: activeColor,
    };

    onChange([...labeling, newLabel].sort((a, b) => a.start - b.start));
    selection.empty();
  };
  const renderTextLabels = () => {
    let lastPos = 0;
    const elements = [];
    const sortedLabels = [...labeling].sort((a, b) => a.start - b.start);

    sortedLabels.forEach((label, index) => {
      if (label.start > lastPos) {
        elements.push(
          <span key={`text-${lastPos}-${label.start}`}>
            {text.slice(lastPos, label.start)}
          </span>
        );
      }

      elements.push(
        <span
          key={`label-${index}`}
          style={{
            backgroundColor: label.label,
            borderRadius: "2px",
            padding: "0 2px",
          }}
        >
          {text.slice(label.start, label.end)}
        </span>
      );

      lastPos = label.end;
    });

    if (lastPos < text.length) {
      elements.push(
        <span key={`text-${lastPos}-end`}>{text.slice(lastPos)}</span>
      );
    }

    return elements;
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          padding: "16px",
          flex: 1,
          fontFamily: "Courier New, monospace",
          fontSize: "14px",
        }}
      >
        <h2 style={{ margin: "0 0 8px" }}>Документ</h2>
        <hr style={{ marginBottom: "12px" }} />
        <div
          ref={textRef}
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            minHeight: "200px",
          }}
          onMouseUp={handleMouseUp}
        >
          {renderTextLabels()}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          padding: "16px",
          width: "180px",
          minHeight: "390px",
          fontSize: "14px",
        }}
      >
        <h2 style={{ margin: "0 0 8px" }}>Метки</h2>
        <hr style={{ marginBottom: "12px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {labels.map(({ color, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleColorSelect(color)}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: color,
                  borderRadius: "0%",
                }}
              />
              <span
                style={{
                  fontWeight: activeColor === color ? "bold" : "normal",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Marker;
