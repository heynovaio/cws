import { ImageField, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";

interface PrismicImageProps {
  image?: ImageField;
  containerClassName?: string;
  className?: string;
  imageHeightClassName?: string;
}

export const ResponsiveImage: React.FC<PrismicImageProps> = ({
  image,
  containerClassName,
  imageHeightClassName = "",
  ...props
}) => {
  if (!isFilled.image(image)) {
    return null;
  }
  return (
    <div className={clsx("relative overflow-hidden", containerClassName)}>
      <PrismicNextImage
        field={image}
        fallbackAlt=""
        className={`object-cover object-center rounded ${imageHeightClassName}`}
        {...props}
      />
    </div>
  );
};