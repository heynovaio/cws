import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Container, ContentBox, Section } from "@/components";
import Link from "next/link";

/**
 * Props for `TagCategory`.
 */
export type TagCategoryProps = SliceComponentProps<Content.TagCategorySlice> & {
  context: { tags?: string[], pageType?: string };
};

/**
 * Component for "TagCategory" Slices.
 */
const TagCategory: FC<TagCategoryProps> = ({ slice, context }) => {
  const { tags } = context;

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <ContentBox
          title={slice.primary.title}
          content={<PrismicRichText field={slice.primary.body} />}
          width="standard"
          buttons={
            tags && tags.length > 0
              ? tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={'/search?tags=' + tag} 
                    className="btn btn-tertiary"
                  >
                    {tag}
                  </Link>
                ))
              : undefined
          }
          containerClassName="flex !rounded-full gap-5 text-center mx-auto flex-col items-center justify-center"
        />
      </Container>
    </Section>
  );
};

export default TagCategory;
