import { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

interface BlockQuoteProps {
  quote: string | RichTextField;
}

export const BlockQuote = ({ quote }: BlockQuoteProps) => {
  const isString = typeof quote === "string";

  return (
    <blockquote className="relative rounded bg-[#4202a9] text-white text-[1.25rem] font-semibold p-6 ">
      <span className="absolute -top-11 -left-0 text-[6rem] text-[#3DD2FF] font-bold select-none pointer-events-none leading-none rotate-6">
        “
      </span>

      <div className="relative z-10">
        {isString ? quote : <PrismicRichText field={quote} />}
      </div>
    </blockquote>
  );
};
