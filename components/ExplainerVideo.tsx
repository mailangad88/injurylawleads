"use client";

import { Player } from "@remotion/player";
import { Explainer } from "@/remotion/Explainer";
import { explainerDuration, FPS, videos } from "@/remotion/videos";

// Plays a Remotion composition right in the page, no MP4 needed.
export function ExplainerVideo({ slug, brand }: { slug: string; brand?: string }) {
  const video = videos.find((v) => v.slug === slug);
  if (!video) return null;
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 shadow">
      <Player
        component={Explainer}
        inputProps={{ ...video.props, brand: brand ?? process.env.NEXT_PUBLIC_SITE_NAME ?? "Injury Claim Guide" }}
        durationInFrames={explainerDuration(video.props.steps.length)}
        fps={FPS}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{ width: "100%", aspectRatio: "16 / 9" }}
        controls
        clickToPlay
        showPosterWhenUnplayed
        renderPoster={() => (
          <div className="@container flex h-full w-full flex-col justify-center bg-slate-950 px-[6%] pb-[8%] text-white">
            <p className="text-[7cqw] font-extrabold leading-tight">{video.props.title}</p>
            <p className="mt-2 text-[3.5cqw] text-blue-200">{video.props.subtitle}</p>
          </div>
        )}
      />
    </div>
  );
}
