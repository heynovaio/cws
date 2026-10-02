import { ReactNode } from "react";

type TwoColRatio = "50/50" | "25/75" | "75/25";
type ThreeColRatio = "33/33/33" | "25/50/25" | "25/25/50" | "50/25/25";
export type SplitLayoutRatio = TwoColRatio | ThreeColRatio;

const TWO_COL_CLASSES: Record<TwoColRatio, [string, string]> = {
  "50/50": ["md:w-1/2", "md:w-1/2"],
  "25/75": ["md:w-1/4", "md:w-3/4"],
  "75/25": ["md:w-3/4", "md:w-1/4"],
};

const THREE_COL_CLASSES: Record<ThreeColRatio, [string, string, string]> = {
  "33/33/33": ["md:w-1/3", "md:w-1/3", "md:w-1/3"],
  "25/50/25": ["md:w-1/4", "md:w-1/2", "md:w-1/4"],
  "25/25/50": ["md:w-1/4", "md:w-1/4", "md:w-1/2"],
  "50/25/25": ["md:w-1/2", "md:w-1/4", "md:w-1/4"],
};

function isTwoCol(ratio: SplitLayoutRatio): ratio is TwoColRatio {
  return ratio in TWO_COL_CLASSES;
}

interface SplitLayoutProps {
  ratio: SplitLayoutRatio;
  children: ReactNode[];
  flip?: boolean;
  gap?: string;
}

export const SplitLayout = ({
  ratio,
  children,
  flip = false,
  gap = "gap-8",
}: SplitLayoutProps) => {
  const cols = isTwoCol(ratio)
    ? TWO_COL_CLASSES[ratio]
    : THREE_COL_CLASSES[ratio as ThreeColRatio];

  const slots = children.slice(0, cols.length);
  const ordered = flip ? [...slots].reverse() : slots;

  return (
    <div className={`flex flex-col md:flex-row ${gap} w-full`}>
      {ordered.map((child, i) => (
        <div key={i} className={`w-full ${cols[i]}`}>
          {child}
        </div>
      ))}
    </div>
  );
};
