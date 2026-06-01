/**
 * SpringAnimationDemo - Demonstrates spring-based animations
 * Based on the remotion skill rule: timing.md
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill, interpolate } from "remotion";

export const SpringAnimationDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Different spring configurations
  const smoothSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const snappySpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const bouncySpring = spring({
    frame,
    fps,
    config: { damping: 8 },
  });

  // Scale animations
  const smoothScale = 0.5 + smoothSpring * 0.5;
  const snappyScale = 0.5 + snappySpring * 0.5;
  const bouncyScale = 0.5 + bouncySpring * 0.5;

  // Rotation animation
  const rotation = interpolate(frame, [0, 60], [0, 360], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f23",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontSize: 48,
          fontFamily: "Arial, sans-serif",
          marginBottom: 60,
        }}
      >
        Spring Animations
      </h1>
      <div
        style={{
          display: "flex",
          gap: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Smooth Spring */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: "#4ecca3",
              borderRadius: 20,
              transform: `scale(${smoothScale}) rotate(${rotation}deg)`,
              marginBottom: 20,
            }}
          />
          <p style={{ color: "#4ecca3", fontSize: 20, fontFamily: "Arial" }}>
            Smooth (damping: 200)
          </p>
        </div>

        {/* Snappy Spring */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: "#e94560",
              borderRadius: 20,
              transform: `scale(${snappyScale}) rotate(${rotation * 0.5}deg)`,
              marginBottom: 20,
            }}
          />
          <p style={{ color: "#e94560", fontSize: 20, fontFamily: "Arial" }}>
            Snappy (damping: 20)
          </p>
        </div>

        {/* Bouncy Spring */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: "#ffd700",
              borderRadius: 20,
              transform: `scale(${bouncyScale})`,
              marginBottom: 20,
            }}
          />
          <p style={{ color: "#ffd700", fontSize: 20, fontFamily: "Arial" }}>
            Bouncy (damping: 8)
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
