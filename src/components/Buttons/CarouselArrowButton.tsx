import React from "react";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

interface CarouselArrowButtonProps {
  text?: string;
  hideIcon?: boolean;
}

export const CarouselArrowButton = ({
  text,
  hideIcon = false,
}: CarouselArrowButtonProps) => {
  return (
    <button>
      {text}
      {hideIcon ? <></> : <HiOutlineArrowLongRight className="h-10 w-10" />}
    </button>
  );
};
