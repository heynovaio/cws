import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `MenuPanel`.
 */
export type MenuPanelProps = SliceComponentProps<Content.MenuPanelSlice>;
/**
 * Component for "MenuPanel" Slices.
 */

const MenuPanel = ({ slice }: MenuPanelProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for menu_panel (variation: {slice.variation}) Slices
    </section>
  );
};
export default MenuPanel;