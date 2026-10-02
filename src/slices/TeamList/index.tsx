import { Container } from "@/components";
import { TeamMemberTile } from "@/components/Tiles/TeamMemberTile";
import { Content } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { Section } from "@/components";
import { hasContent } from "@/utils";

export type TeamListProps = SliceComponentProps<Content.TeamListSlice>;

const TeamList = ({ slice }: TeamListProps): JSX.Element => {
  const hasTitle = hasContent(slice.primary.title);
  const hasBody = hasContent(slice.primary.body);

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        {(hasTitle || hasBody) && (
          <div className="text-center mb-10">
            {hasTitle && <PrismicRichText field={slice.primary.title} />}
            {hasBody && <PrismicRichText field={slice.primary.body} />}
          </div>
        )}
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {slice.primary.team_member.map((team_member, index) => (
            <TeamMemberTile
              key={index}
              name={team_member.name}
              position={team_member.position}
              image={team_member.image}
              link={team_member.link}
              linkLabel={team_member.link.text}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TeamList;
