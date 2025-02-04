import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string | null | undefined;
  styling?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}
export const Section: React.FC<SectionProps> = ({
  children,
  backgroundColor,
  styling,
  ...props
}) => {
  let background: string;

  switch (backgroundColor) {
    case "Light":
      background = "bg-secondary light-background-text dark-tile";
      break;
    case "Dark":
      background = "bg-primary text-white light-tile";
      break;
    case "White":
      background = "bg-white light-background-text dark-tile";
      break;
    default:
      background = "bg-white light-background-text dark-tile";
      break;
  }

  return (
    <section className={`py-14 md:py-20 ${background} ${styling}`} {...props}>
      {children}
    </section>
  );
};
