import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerClassName?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}
export const Container: React.FC<ContainerProps> = ({
  children,
  containerClassName,
  ...props
}) => {
  return (
    // Horizontal padding
    <div
      className={`px-5 mx-auto max-w-screen-xl w-full ${containerClassName}`}
      {...props}
    >
      {children}
    </div>
  );
};