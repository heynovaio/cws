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
import React, { useEffect, useRef } from "react";

const HashtagBanner = ({ slice }: HashtagBannerProps) => {
  const word = slice.primary.display_word;
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (bannerRef.current) {
        bannerRef.current.style.transform = `translateX(-${scrollTop * 0.5}px)`;
      }
    };

    const onScroll = () => requestAnimationFrame(handleScroll);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-navy-background pt-20 pb-20 overflow-hidden"
    >
      <div className="neon-banner">
        <div
          className="flex whitespace-nowrap gap-10 justify-center will-change-transform"
          ref={bannerRef}
        >
          {Array.from({ length: 50 }).map((_, idx) => (
            <h3 key={idx} className="text-3xl font-bold text-white px-4">
              {word}
            </h3>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HashtagBanner;
