/**
 * SequencingDemo - Demonstrates Sequence and Series patterns
 * Based on the remotion skill rule: sequencing.md
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence, Series, AbsoluteFill, spring, interpolate } from "remotion";

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#667eea",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: 72, fontFamily: "Arial" }}>
          Scene 1
        </h1>
        <p style={{ color: "#fff", fontSize: 32, fontFamily: "Arial" }}>
          Spring entrance animation
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 30], [100, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#764ba2",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: 72, fontFamily: "Arial" }}>
          Scene 2
        </h1>
        <p style={{ color: "#fff", fontSize: 32, fontFamily: "Arial" }}>
          Fade in with slide up
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 60], [0, 360], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f093fb",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            backgroundColor: "#fff",
            borderRadius: 30,
            transform: `rotate(${rotation}deg)`,
            margin: "0 auto 30px",
          }}
        />
        <h1 style={{ color: "#fff", fontSize: 72, fontFamily: "Arial" }}>
          Scene 3
        </h1>
        <p style={{ color: "#fff", fontSize: 32, fontFamily: "Arial" }}>
          Rotation animation
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const SequencingDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={60}>
          <Scene1 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60}>
          <Scene2 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60}>
          <Scene3 />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
