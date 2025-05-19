import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string | null | undefined;
  styling?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}
export const Section: React.FC<SectionProps> = ({
  children,
  styling,
  backgroundColor,
  ...props
}) => {
  let background: string;

  switch (backgroundColor) {
    case "No Background":
      background = "bg-midnight";
      break;
    case "Darker":
      background = "bg-dark-purple-background";
      break;
    default:
      background = "bg-midnight";
      break;
  }
  return (
    // Vertical Padding
    <section
      className={`py-16 print:py-0 print:my-0 w-full ${background} ${styling}`}
      {...props}
    >
      {children}
    </section>
  );
};
