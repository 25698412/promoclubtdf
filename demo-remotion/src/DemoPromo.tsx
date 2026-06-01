/**
 * DemoPromo - Promotional video for PROMO CLUB TDF
 * Showcases multiple Remotion skills: sequences, springs, typewriter, transitions
 */
import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Sequence,
  Series,
  spring,
  interpolate,
} from "remotion";

// Types for props
export type DemoPromoProps = {
  title: string;
  subtitle: string;
  cta: string;
};

// Scene 1: Title with spring animation
const TitleScene: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: 96,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Subtitle with fade-in and slide-up
const SubtitleScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 30], [80, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
          padding: "0 100px",
        }}
      >
        <p
          style={{
            color: "#ffffff",
            fontSize: 56,
            fontFamily: "Arial, sans-serif",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Features showcase with staggered animations
const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🎁", text: "Ofertas Exclusivas" },
    { icon: "📍", text: "Negocios Locales" },
    { icon: "⭐", text: "Recompensas" },
    { icon: "📱", text: "App Móvil" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap" as const,
          justifyContent: "center",
          gap: 40,
          maxWidth: 1400,
          padding: 40,
        }}
      >
        {features.map((feature, index) => {
          const delay = index * 15;
          const featureFrame = Math.max(0, frame - delay);
          const scale = spring({
            frame: featureFrame,
            fps,
            config: { damping: 200 },
          });
          const opacity = interpolate(featureFrame, [0, 15], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={index}
              style={{
                transform: `scale(${scale})`,
                opacity,
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 20,
                padding: "40px 50px",
                textAlign: "center",
                minWidth: 250,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 15 }}>
                {feature.icon}
              </div>
              <p
                style={{
                  color: "#333",
                  fontSize: 28,
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                {feature.text}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA with typewriter effect
const CTAScene: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsToShow = Math.min(Math.floor(frame / 4), cta.length);
  const displayedText = cta.slice(0, charsToShow);
  const showCursor = Math.floor(frame / 12) % 2 === 0;

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
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
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "50px 80px",
            borderRadius: 20,
            boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
          }}
        >
          <p
            style={{
              color: "#e94560",
              fontSize: 72,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            {displayedText}
            {showCursor && "|"}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const DemoPromo: React.FC<DemoPromoProps> = ({
  title,
  subtitle,
  cta,
}) => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <TitleScene title={title} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <SubtitleScene subtitle={subtitle} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <FeaturesScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <CTAScene cta={cta} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
