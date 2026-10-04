import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTRO_FRAMES, OUTRO_FRAMES, STEP_FRAMES, type ExplainerProps } from "./videos";

const NAVY = "#1e3a8a";
const AMBER = "#f59e0b";
const font = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

function useEnter(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` };
}

function Intro({ title, subtitle }: { title: string; subtitle: string }) {
  const a = useEnter(0);
  const b = useEnter(12);
  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", padding: 120, fontFamily: font }}>
      <div style={{ ...a, color: "white", fontSize: 110, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
      <div style={{ ...b, color: "#bfdbfe", fontSize: 54, marginTop: 30 }}>{subtitle}</div>
    </AbsoluteFill>
  );
}

function Step({ index, total, heading, body }: { index: number; total: number; heading: string; body: string }) {
  const frame = useCurrentFrame();
  const num = useEnter(0);
  const h = useEnter(8);
  const p = useEnter(18);
  const out = interpolate(frame, [STEP_FRAMES - 12, STEP_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "white", padding: 120, justifyContent: "center", fontFamily: font, opacity: out }}>
      <div style={{ ...num, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 110, height: 110, borderRadius: 999, background: AMBER, color: "#0f172a", fontSize: 60, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {index + 1}
        </div>
        <div style={{ color: "#64748b", fontSize: 36, fontWeight: 600 }}>Step {index + 1} of {total}</div>
      </div>
      <div style={{ ...h, color: NAVY, fontSize: 96, fontWeight: 800, marginTop: 40 }}>{heading}</div>
      <div style={{ ...p, color: "#334155", fontSize: 50, lineHeight: 1.35, marginTop: 24, maxWidth: 1500 }}>{body}</div>
    </AbsoluteFill>
  );
}

function Outro({ cta, brand }: { cta: string; brand: string }) {
  const a = useEnter(0);
  const b = useEnter(10);
  return (
    <AbsoluteFill style={{ background: NAVY, justifyContent: "center", alignItems: "center", fontFamily: font, textAlign: "center" }}>
      <div style={{ ...a, background: AMBER, color: "#0f172a", fontSize: 80, fontWeight: 800, padding: "36px 72px", borderRadius: 28 }}>{cta}</div>
      <div style={{ ...b, color: "white", fontSize: 50, marginTop: 40, fontWeight: 700 }}>{brand}</div>
      <div style={{ ...b, color: "#93c5fd", fontSize: 26, marginTop: 50, maxWidth: 1400 }}>
        Attorney advertising. Not a law firm. General information, not legal advice. Prior results do not guarantee a similar outcome.
      </div>
    </AbsoluteFill>
  );
}

export function Explainer({ title, subtitle, steps, cta, brand }: ExplainerProps) {
  return (
    <AbsoluteFill style={{ background: "white" }}>
      <Sequence durationInFrames={INTRO_FRAMES}>
        <Intro title={title} subtitle={subtitle} />
      </Sequence>
      {steps.map((s, i) => (
        <Sequence key={i} from={INTRO_FRAMES + i * STEP_FRAMES} durationInFrames={STEP_FRAMES}>
          <Step index={i} total={steps.length} heading={s.heading} body={s.body} />
        </Sequence>
      ))}
      <Sequence from={INTRO_FRAMES + steps.length * STEP_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <Outro cta={cta} brand={brand} />
      </Sequence>
    </AbsoluteFill>
  );
}
