import { Button } from "@/app/components/Button";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `CallToAction`.
 */
export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/**
 * Component for "CallToAction" Slices.
 */
const CallToAction = ({ slice }: CallToActionProps): JSX.Element => {
  console.log(slice.primary.button);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for call_to_action (variation: {slice.variation})
      Slices
      {slice.primary.button.map((link) => (
        <Button
          buttonLink={link}
          buttonType="primary"
          label={link.text}
          key={link.key}
        />
      ))}
    </section>
  );
};

export default CallToAction;
