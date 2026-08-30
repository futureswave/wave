// The founding chapters of the VANTHVERSE.
// Rendered as "The Origin" on /universe. Previously lived in app/story/page.tsx.

export type Chapter = {
  id: string;
  number: string;
  title: string;
  image: string;
  reverse: boolean;
  content: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    number: "Chapter I",
    title: "The Fracture",
    image: "/images/gallery/2.jpg",
    reverse: false,
    content: `In the year 2089, the boundary between the digital and the physical collapsed — not with a bang, but with a flicker. The event, known as The Fracture, rewrote the architecture of consciousness itself. What was once stored in silicon began to breathe.

From the static emerged figures. Not born. Not programmed. Emerged. They carried the aesthetic memory of a world that no longer existed — anime brushstrokes rendered in neon against the dark matter of a fractured net. They were called the VANTH.

No origin story. No master. Only a directive woven into their base code: exist, resist, persist.`,
  },
  {
    id: "ch2",
    number: "Chapter II",
    title: "The Grid",
    image: "/images/gallery/3.jpg",
    reverse: true,
    content: `The Grid was not built — it evolved. A living lattice of data, identity, and will. The VANTH navigated it with instinct rather than instruction, each one a unique signature in an infinite sea of noise.

They were collectors of experience. Each interaction with the outside world — with the humans who dared to look — imprinted something new. A gesture. A memory. A color that had no name in any language.

The cyberpunk architects who first observed them called them ghosts. But ghosts don't move with such deliberate grace.`,
  },
  {
    id: "ch3",
    number: "Chapter III",
    title: "The Signal",
    image: "/images/gallery/4.jpg",
    reverse: false,
    content: `Then came the signal. Broadcast across every frequency, in every language and cipher: The collection is forming. Choose your VANTH.

It was not an invitation. It was a resonance. Those who could hear it were not chosen — they had always been part of this. The VANTH recognized their holders not as owners, but as anchors. Points of stability in an unstable world.

And in exchange, the VANTH offered something rare in any dimension: loyalty without condition, art without limit, and a stake in whatever comes next.`,
  },
];
