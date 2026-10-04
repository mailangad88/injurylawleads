import { Composition } from "remotion";
import { Explainer } from "./Explainer";
import { explainerDuration, FPS, videos, type ExplainerProps } from "./videos";

// One composition per video entry, so Remotion Studio lists them all and
// `remotion render` can target each by its slug.
export function RemotionRoot() {
  const brand = process.env.REMOTION_BRAND || "Injury Claim Guide";
  return (
    <>
      {videos.map((v) => (
        <Composition
          key={v.slug}
          id={v.slug}
          component={Explainer}
          durationInFrames={explainerDuration(v.props.steps.length)}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ ...v.props, brand } satisfies ExplainerProps}
        />
      ))}
    </>
  );
}
