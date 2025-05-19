import { PrismicRichText } from "@prismicio/react";
import React, { ReactNode } from "react";
import clsx from "clsx";
import { getWidthClassNames, WidthProp } from "@/utils";
import { RichTextField } from "@prismicio/client";

interface ContentBoxProps {
  children?: ReactNode;
  title?: string | RichTextField | undefined;
  tagline?: string;
  titleClassName?: string;
  content?: ReactNode | undefined;
  buttons?: ReactNode[];
  width?: WidthProp;
  containerClassName?: string;
  titleComponents?: {
    [key: string]: React.FC<{ children: ReactNode }>;
  };
  titleLevel?: 2 | 3; // New prop to control heading level
}

export const ContentBox: React.FC<ContentBoxProps> = ({
  children,
  title,
  tagline,
  titleClassName,
  content,
  buttons,
  width = "full",
  containerClassName,
  titleComponents,
  titleLevel = 2,
  ...props
}) => {
  const widthClassName = getWidthClassNames(width);

  const TitleHeading = ({ children }: { children: ReactNode }) => {
    return titleLevel === 2 ? (
      <h2 className={titleClassName}>{children}</h2>
    ) : (
      <h3 className={titleClassName}>{children}</h3>
    );
  };

  return (
    <div
      data-test-id="contentbox"
      className={clsx(
        "flex flex-col gap-7 contentBox ",
        widthClassName,
        containerClassName
      )}
      {...props}
    >
      <div className={`flex flex-col w-full gap-2`}>
        <div className={titleClassName}>
          {tagline && <div className="text-bodyLarge">{tagline}</div>}
          {typeof title === "string" ? (
            <TitleHeading>{title}</TitleHeading>
          ) : (
            <PrismicRichText field={title} components={titleComponents} />
          )}
        </div>
        {content && <div className="text-content">{content}</div>}
      </div>
      {buttons && buttons.length > 0 && (
        <div className="flex gap-6">{buttons}</div>
      )}
      {children}
    </div>
  );
};
