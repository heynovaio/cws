import { Container, ResponsiveImage } from "@/components";
import { TeamMemberTile } from "@/components/Tiles/TeamMemberTile";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { Section } from "@/components";

/**
 * Props for `TeamList`.
 */
export type TeamListProps = SliceComponentProps<Content.TeamListSlice>;

/**
 * Component for "TeamList" Slices.
 */
const TeamList = ({ slice }: TeamListProps): JSX.Element => {
  const darkerBackground = slice.primary.background_color == "Darker";
  const bgColor = darkerBackground
    ? "bg-dark-purple-background"
    : "bg-midnight";
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`${bgColor} py-10`}
    >
      <Container>
        {(slice.primary.title || slice.primary.body) && (
          <div className="text-center mb-10">
            {slice.primary.title && (
              <PrismicRichText field={slice.primary.title} />
            )}
            {slice.primary.body && (
              <PrismicRichText field={slice.primary.body} />
            )}
          </div>
        )}

        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {slice.primary.team_member.map((team_member, index) => (
            <TeamMemberTile
              key={index}
              name={team_member.name}
              position={team_member.position}
              image={team_member.image}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TeamList;
