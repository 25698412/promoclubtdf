import { Composition, Folder } from "remotion";
import { DemoPromo } from "./DemoPromo";
import { FadeInDemo } from "./components/FadeInDemo";
import { TypewriterDemo } from "./components/TypewriterDemo";
import { SpringAnimationDemo } from "./components/SpringAnimationDemo";
import { SequencingDemo } from "./components/SequencingDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Demos">
        <Composition
          id="DemoPromo"
          component={DemoPromo}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "PROMO CLUB TDF",
            subtitle: "Descubre las mejores ofertas",
            cta: "¡Únete ahora!",
          }}
        />
      </Folder>
      <Folder name="Skills-Showcase">
        <Composition
          id="FadeInDemo"
          component={FadeInDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="TypewriterDemo"
          component={TypewriterDemo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SpringAnimationDemo"
          component={SpringAnimationDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SequencingDemo"
          component={SequencingDemo}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
