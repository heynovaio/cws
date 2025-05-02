import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `TagCategory`.
 */
export type TagCategoryProps = SliceComponentProps<Content.TagCategorySlice>;

/**
 * Component for "TagCategory" Slices.
 */
const TagCategory: FC<TagCategoryProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for tag_category (variation: {slice.variation})
      Slices
    </section>
  );
};

export default TagCategory;
