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
      <ResponsiveImage
        containerClassName="w-auto flex items-center justify-center"
        image={node}
      />
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

export const componentsTextSmall: JSXMapSerializer = {
  listItem: ({ children }) => <li className="mb-4">{children}</li>,
  oListItem: ({ children }) => <li className="mb-4">{children}</li>,
  list: ({ children }) => (
    <ul className="inline-block text-left mb-4">{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className="inline-block text-left mb-4">{children}</ol>
  ),
  paragraph: ({ children }) => <p className="text-base mb-4">{children}</p>,
  heading1: ({ children }) => <h1 className="mb-4">{children}</h1>,
  heading2: ({ children }) => <h2 className="mb-4">{children}</h2>,
  heading3: ({ children }) => <h3 className="mb-4">{children}</h3>,
  heading4: ({ children }) => <h4 className="mb-4">{children}</h4>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink field={node.data} className="text-aqua">
      {children}
    </PrismicNextLink>
  ),
  image: ({ node }) => {
    const imageElement = <ResponsiveImage containerClassName="" image={node} />;

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
