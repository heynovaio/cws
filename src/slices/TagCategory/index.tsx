import { FC } from "react";
import { Content } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { Container, ContentBox, Section } from "@/components";
import { hasContent } from "@/utils";
import Link from "next/link";

export type TagCategoryProps = SliceComponentProps<Content.TagCategorySlice> & {
  context: { tags?: string[], pageType?: string };
};

const TagCategory: FC<TagCategoryProps> = ({ slice, context }) => {
  const { tags } = context;

  const hasTitle = hasContent(slice.primary.title);
  const hasBody = hasContent(slice.primary.body);
  const hasTags = tags && tags.length > 0;

  if (!hasTitle && !hasBody && !hasTags) return null;

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <ContentBox
          title={hasTitle ? slice.primary.title : undefined}
          content={hasBody ? <PrismicRichText field={slice.primary.body} /> : undefined}
          width="standard"
          buttons={
            hasTags
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