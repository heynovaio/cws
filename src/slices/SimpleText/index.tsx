import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `SimpleText`.
 */
export type SimpleTextProps = SliceComponentProps<Content.SimpleTextSlice>;

/**
 * Component for "SimpleText" Slices.
 */
const SimpleText = ({ slice }: SimpleTextProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for simple_text (variation: {slice.variation})
      Slices
    </section>
  );
};

export default SimpleText;
