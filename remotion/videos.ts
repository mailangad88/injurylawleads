// Data for the programmatic explainer videos. Add an entry here and it appears
// on /videos, can be embedded in any guide with <ExplainerVideo slug="..." />,
// and can be rendered to MP4 with `npm run video:render`.
// Keep the claims general and accurate: these are attorney advertising too.

export type ExplainerStep = { heading: string; body: string };

export type ExplainerProps = {
  title: string;
  subtitle: string;
  steps: ExplainerStep[];
  cta: string;
  brand: string;
};

export type VideoEntry = {
  slug: string;
  description: string;
  guideHref?: string;
  props: Omit<ExplainerProps, "brand">;
};

export const videos: VideoEntry[] = [
  {
    slug: "after-a-car-accident",
    description: "Five things to do in the first days after a crash to protect your health and your claim.",
    guideHref: "/guides/car-accidents/what-to-do-after-a-car-accident",
    props: {
      title: "Hurt in a car accident?",
      subtitle: "5 steps to protect your health and your claim",
      steps: [
        { heading: "Get medical care", body: "Some injuries show up days later. A doctor's visit also creates a record of what happened to you." },
        { heading: "Document everything", body: "Photos of the cars, the scene and your injuries. Names and numbers of witnesses." },
        { heading: "Get the police report", body: "It records who was involved, their insurance, and often an officer's view of fault." },
        { heading: "Be careful with adjusters", body: "The other driver's insurer may ask for a recorded statement. You don't have to give one right away." },
        { heading: "Talk to an injury lawyer", body: "Most work on contingency, so a consultation is free and you pay nothing unless they recover money." },
      ],
      cta: "Get a free case review",
    },
  },
  {
    slug: "how-contingency-fees-work",
    description: "How injury lawyers get paid, and why most people pay nothing up front.",
    guideHref: "/guides/claims-process/how-contingency-fees-work",
    props: {
      title: "Can I afford an injury lawyer?",
      subtitle: "How contingency fees work",
      steps: [
        { heading: "No upfront cost", body: "Most injury lawyers charge nothing to start and nothing by the hour." },
        { heading: "A percentage if you win", body: "The fee is a share of the recovery, often around one third, agreed in writing." },
        { heading: "No win, no fee", body: "If there is no recovery, you generally owe no attorney fee. Ask how case costs are handled." },
      ],
      cta: "See if you have a case",
    },
  },
];

export const FPS = 30;
export const INTRO_FRAMES = 90;
export const STEP_FRAMES = 150;
export const OUTRO_FRAMES = 120;

export function explainerDuration(steps: number) {
  return INTRO_FRAMES + steps * STEP_FRAMES + OUTRO_FRAMES;
}
