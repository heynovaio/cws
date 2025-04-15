import React, { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  containerClassName?: string;
  props?: HTMLAttributes<HTMLDivElement>;
}
export const Container: React.FC<ContainerProps> = ({
  children,
  containerClassName,
  ...props
}) => {
  return (
    <div
      className={`px-5 mx-auto max-w-screen-xl w-full ${containerClassName}`}
      {...props}
    >
      {children}
    </div>
  );
};
