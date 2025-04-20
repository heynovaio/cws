import { PrismicRichText } from "@prismicio/react";
import React, { ReactNode } from "react";
import clsx from "clsx";
import { getWidthClassNames, WidthProp } from "@/utils";
import { RichTextField } from "@prismicio/client";

interface ContentBoxProps {
  children?: ReactNode;
  title: string | RichTextField;
  titleClassName?: string;
  content?: ReactNode;
  titleGap?: string;
  buttons?: ReactNode[];
  width?: WidthProp;
  containerClassName?: string;
}
export const ContentBox: React.FC<ContentBoxProps> = ({
  children,
  title,
  titleClassName,
  content,
  buttons,
  width = "full",
  containerClassName,
  ...props
}) => {
  const widthClassName = getWidthClassNames(width);
  return (
    <div
      data-test-id="contentbox"
      className={clsx(
        "flex flex-col gap-7 contentBox",
        widthClassName,
        containerClassName
      )}
      {...props}
    >
      <div className={`flex flex-col w-full gap-2`}>
        <div className={titleClassName}>
          {typeof title === "string" ? (
            <h2 className={titleClassName}>{title}</h2>
          ) : (
            <PrismicRichText field={title} />
          )}
        </div>
        {content && <div>{content}</div>}
      </div>
      {buttons && buttons.length > 0 && <div className="w-full">{buttons}</div>}
      {children}
    </div>
  );
};
