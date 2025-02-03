import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `TeamList`.
 */
export type TeamListProps = SliceComponentProps<Content.TeamListSlice>;

/**
 * Component for "TeamList" Slices.
 */
const TeamList = ({ slice }: TeamListProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for team_list (variation: {slice.variation}) Slices
    </section>
  );
};

export default TeamList;
