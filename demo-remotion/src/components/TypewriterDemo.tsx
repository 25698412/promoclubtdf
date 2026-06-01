/**
 * TypewriterDemo - Demonstrates typewriter text animation effect
 * Based on the remotion skill rule: text-animations.md
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

export const TypewriterDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullText = "Bienvenido a PROMO CLUB TDF!";
  // Type one character every 3 frames
  const charsToShow = Math.min(Math.floor(frame / 3), fullText.length);
  const displayedText = fullText.slice(0, charsToShow);

  // Blinking cursor
  const showCursor = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#16213e",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            color: "#0f3460",
            fontSize: 64,
            fontFamily: "monospace",
            marginBottom: 40,
          }}
        >
          Typewriter Effect
        </h1>
        <div
          style={{
            backgroundColor: "#1a1a2e",
            padding: "30px 50px",
            borderRadius: 12,
            display: "inline-block",
          }}
        >
          <p
            style={{
              color: "#e94560",
              fontSize: 48,
              fontFamily: "monospace",
              margin: 0,
            }}
          >
            {displayedText}
            {showCursor && "|"}
          </p>
        </div>
        <p
          style={{
            color: "#a0a0a0",
            fontSize: 24,
            fontFamily: "Arial, sans-serif",
            marginTop: 40,
          }}
        >
          Frame: {frame} | Characters: {charsToShow}/{fullText.length}
        </p>
      </div>
    </AbsoluteFill>
  );
};
