import { ResponsiveImage } from "@/components";
import { PrismicNextLink } from "@prismicio/next";
import { JSXMapSerializer } from "@prismicio/react";

export const components: JSXMapSerializer = {
  listItem: ({ children }) => <li>{children}</li>,
  oListItem: ({ children }) => <li>{children}</li>,
  list: ({ children }) => <ul>{children}</ul>,
  oList: ({ children }) => <ol>{children}</ol>,
  image: ({ node }) => {
    const imageElement = (
      <ResponsiveImage containerClassName="w-auto" image={node} />
    );

    if (node.linkTo) {
      return (
        <PrismicNextLink
          field={node.linkTo}
          className="flex flex-col justify-center items-center hover:outline hover:outline-primary rounded-2xl"
        >
          {imageElement}
        </PrismicNextLink>
      );
    }

    return imageElement;
  },
};
