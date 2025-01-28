import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `MultiLinkColumn`.
 */
export type MultiLinkColumnProps =
  SliceComponentProps<Content.MultiLinkColumnSlice>;

/**
 * Component for "MultiLinkColumn" Slices.
 */
const MultiLinkColumn = ({ slice }: MultiLinkColumnProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for multi_link_column (variation: {slice.variation})
      Slices
    </section>
  );
};

export default MultiLinkColumn;
