// "The VANTH Evolution" — the roadmap replacement (NOW / NEXT / FUTURE).

export type EvolutionPhase = {
  marker: string;
  label: string;
  title: string;
  items: string[];
};

export const EVOLUTION: EvolutionPhase[] = [
  {
    marker: "NOW",
    label: "Building",
    title: "Building the Foundation",
    items: [
      "Art development",
      "Universe development",
      "Community formation",
      "Brand identity",
    ],
  },
  {
    marker: "NEXT",
    label: "Expanding",
    title: "Expanding the Collective",
    items: [
      "Collection reveal",
      "Community activations",
      "Partnerships",
      "Holder access",
    ],
  },
  {
    marker: "FUTURE",
    label: "Evolving",
    title: "Beyond the Collection",
    items: [
      "Digital experiences",
      "Interactive concepts",
      "Digital identity",
      "Experimental ecosystem features",
    ],
  },
];
