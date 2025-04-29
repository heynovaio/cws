import { PrismicRichText } from "@prismicio/react";
import React, { ReactNode } from "react";
import clsx from "clsx";
import { getWidthClassNames, WidthProp } from "@/utils";
import { RichTextField } from "@prismicio/client";

interface ContentBoxProps {
  children?: ReactNode;
  title: string | RichTextField;
  tagline?: string;
  titleClassName?: string;
  content?: ReactNode | undefined;
  buttons?: ReactNode[];
  width?: WidthProp;
  containerClassName?: string;
  titleComponents?: {
    [key: string]: React.FC<{ children: ReactNode }>;
  };
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
  ...props
}) => {
  const widthClassName = getWidthClassNames(width);

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
            <h2 className={titleClassName}>{title}</h2>
          ) : (
            <PrismicRichText field={title} components={titleComponents} />
          )}
        </div>
        {content && <div>{content}</div>}
      </div>
      {buttons && buttons.length > 0 && <div className="flex gap-6">{buttons}</div>}
      {children}
    </div>
  );
};
