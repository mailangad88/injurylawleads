import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Background } from "./videos";

const font = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

function resolveSrc(src: string) {
  return /^https?:\/\//.test(src) ? src : staticFile(src);
}

function kindOf(bg: Background) {
  if (bg.kind) return bg.kind;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(bg.src) ? "video" : "image";
}

// Full-bleed image or clip with a dark scrim so white text stays readable,
// a slow push-in on stills, and a "Dramatization" label for depicted events.
export function Backdrop({ background }: { background: Background }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const src = resolveSrc(background.src);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {kindOf(background) === "video" ? (
        <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.6) 60%, rgba(15,23,42,0.35) 100%)" }} />
      {background.dramatization !== false && (
        <div style={{ position: "absolute", top: 40, right: 48, fontFamily: font, fontSize: 26, fontWeight: 600, color: "white", background: "rgba(0,0,0,0.55)", padding: "8px 18px", borderRadius: 8, letterSpacing: 1 }}>
          DRAMATIZATION
        </div>
      )}
    </AbsoluteFill>
  );
}
