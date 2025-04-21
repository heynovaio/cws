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
  ...props
}) => {

  return (
    // Vertical Padding
    <section
      className={`py-8 print:py-0 print:my-0 w-full ${styling}`}
      {...props}
    >
      {children}
    </section>
  );
};
