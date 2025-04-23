"use client";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useCallback, useRef, useEffect } from "react";

/**
 * Carousel Button - Intended for carousel slide navigation
 *
 * @see For implementation example, see the handleSlideChange function in ./index (TabbedCarousel component)
 */

interface CarouselButtonProps {
  currentSlide: number;
  totalSlides: number;
  onSlideChange: (direction: "prev" | "next") => void;
  styling?: string;
}

export const CarouselButton = ({
  currentSlide,
  totalSlides,
  onSlideChange,
  styling,
}: CarouselButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        !containerRef.current ||
        !containerRef.current.contains(document.activeElement)
      )
        return;

      if (event.key === "ArrowLeft") {
        onSlideChange("prev");
      } else if (event.key === "ArrowRight") {
        onSlideChange("next");
      }
    },
    [onSlideChange]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className={`flex items-center gap-2 rounded-md bg-white text-midnight focus:bg-light-violet shadow focus ${styling}`}
      ref={containerRef}
      tabIndex={0}
    >
      <button
        onClick={() => currentSlide > 1 && onSlideChange("prev")}
        aria-label="Previous slide"
        aria-disabled={currentSlide === 1}
        tabIndex={0}
        className={`rounded-md p-2 focus ${
          currentSlide === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-neon-violet rounded-md"
        }`}
      >
        <HiOutlineArrowLongRight className="h-5 w-5 rotate-180" />
      </button>
      <span aria-live="polite" aria-atomic="true">
        {currentSlide}/{totalSlides}
      </span>
      <button
        onClick={() => currentSlide < totalSlides && onSlideChange("next")}
        aria-label="Next slide"
        aria-disabled={currentSlide === totalSlides}
        tabIndex={0}
        className={`rounded-md p-2 focus ${
          currentSlide === totalSlides
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-neon-violet"
        }`}
      >
        <HiOutlineArrowLongRight className="h-5 w-5" />
      </button>
    </div>
  );
};
