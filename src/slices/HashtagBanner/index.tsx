"use client";

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `HashtagBanner`.
 */
export type HashtagBannerProps =
  SliceComponentProps<Content.HashtagBannerSlice>;

/**
 * Component for "HashtagBanner" Slices.
 */
import React, { useEffect, useState } from "react";

const HashtagBanner = ({ slice }: HashtagBannerProps) => {
  const word = slice.primary.display_word;
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      console.log("moving");
      const scrollTop = window.scrollY; // vertical scroll position
      setOffsetX(scrollTop * 0.5); // adjust speed here (0.5 = slower, 1 = equal)
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-navy-background pt-20 pb-20 overflow-hidden"
    >
      <div className="neon-banner">
        <div
          className="flex whitespace-nowrap gap-10 justify-center"
          style={{
            transform: `translateX(-${offsetX}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {Array.from({ length: 50 }).map((_, idx) => (
            <h3 key={idx} className="text-3xl font-bold text-white px-4">
              #{word}
            </h3>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HashtagBanner;
