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
      background = "bg-light-blue";
      break;
    case "Dark":
      background = "bg-primary";
      break;
    case "White":
      background = "bg-white";
      break;
    default:
      background = "bg-white";
      break;
  }

  return (
    // Vertical Padding
    <section
      className={`py-8 print:py-0 print:my-0 w-full ${background} ${styling}`}
      {...props}
    >
      {children}
    </section>
  );
};
