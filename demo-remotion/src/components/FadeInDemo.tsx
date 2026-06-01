/**
 * FadeInDemo - Demonstrates basic fade-in animation
 * Following Remotion best practices: animations driven by useCurrentFrame()
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

export const FadeInDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in over 2 seconds (from 0 to 1 opacity)
  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slide up while fading in
  const translateY = interpolate(frame, [0, 2 * fps], [50, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: 72,
            fontFamily: "Arial, sans-serif",
            marginBottom: 20,
          }}
        >
          Fade In Animation
        </h1>
        <p
          style={{
            color: "#e0e0e0",
            fontSize: 32,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Smooth opacity transition with slide-up effect
        </p>
      </div>
    </AbsoluteFill>
  );
};
