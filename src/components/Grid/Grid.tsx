import { NumberField } from "@prismicio/client";
import clsx from "clsx";
import React, { ReactNode } from "react";

interface GridProps {
  maxColumns: number | NumberField | undefined;
  gridClassName?: string;
  children: ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  maxColumns = 3,
  gridClassName,
  children,
  ...props
}) => {
  const columns = Math.max(1, Math.min(Number(maxColumns), 4));
  const gridClasses = {
    base: "grid gap-5",
    responsive:
      columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
          : columns === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1",
  };

  return (
    <div
      className={clsx(gridClasses.base, gridClasses.responsive, gridClassName)}
      {...props}
    >
      {children}
    </div>
  );
};
