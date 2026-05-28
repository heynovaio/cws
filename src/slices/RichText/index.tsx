'use client';
import { Content, isFilled } from "@prismicio/client";
import { Container, Section } from "@/components";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { PrismicLink, PrismicTable, SliceComponentProps } from "@prismicio/react";
import { JSX, useRef, useEffect, useState } from "react";
import { components, hasContent } from "@/utils";
import { SplitLayout, SplitLayoutRatio } from "@/components";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

function TableWrapper({ children, styleClass }: { children: React.ReactNode; styleClass: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setShowFade(el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    check();
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => { el.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className={`cws-table-wrapper ${styleClass}`}>
        {children}
      </div>
      {showFade && <div className="cws-table-fade" aria-hidden="true" />}
    </div>
  );
}

const RichText = ({ slice }: RichTextProps): JSX.Element | null => {
  if (slice.variation === "richTextWithTable") {
    const p = slice.primary;
    const leftAligned = p.text_alignment === false;
    const textAlignment = leftAligned ? "items-start text-left" : "items-center text-center";
    const isStacked = !p.column_layout || p.column_layout === "Stacked";
    const tableFirst = p.column_order === "Table First";
    const ratio = (isStacked ? null : p.column_layout) as SplitLayoutRatio | null;
    const styleClass = p.table_style === "Purple Header + Transparent Background"
      ? "cws-table--transparent"
      : "cws-table--white";

    const contentBlock = (
      <div className={`flex flex-col gap-4 ${textAlignment}`}>
        {hasContent(p.content) && (
          <PrismicRichText field={p.content} components={components} />
        )}
        {isFilled.link(p.button) && (
          <PrismicLink field={p.button} className="btn btn--primary" />
        )}
      </div>
    );

    const tableBlock = hasContent(p.table) ? (
      <TableWrapper styleClass={styleClass}>
        <PrismicTable
          field={p.table}
          components={{
            table: ({ children }) => (
              <table className="cws-table">{children}</table>
            ),
            th: ({ children }) => (
              <th scope="col" className="cws-table__th">{children}</th>
            ),
            td: ({ children }) => (
              <td className="cws-table__td">{children}</td>
            ),
          }}
        />
      </TableWrapper>
    ) : null;

    const firstBlock = tableFirst ? tableBlock : contentBlock;
    const secondBlock = tableFirst ? contentBlock : tableBlock;
    return (
      <Section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        <Container>
          {isStacked || !ratio ? (
            <div className="flex flex-col gap-8">
              {firstBlock}
              {secondBlock}
            </div>
          ) : (
            <SplitLayout ratio={ratio}>
              {firstBlock}
              {secondBlock}
            </SplitLayout>
          )}
        </Container>
      </Section>
    );
  }

  const leftAligned = slice.primary.text_alignment === false;
  const textAlignment = leftAligned ? "items-start text-left" : "items-center text-center";
  if (!hasContent(slice.primary.content)) return null;

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <div className={`text-content max-w-[900px] mx-auto ${textAlignment}`}>
          <PrismicRichText field={slice.primary.content} components={components} />
        </div>
      </Container>
    </Section>
  );
};

export default RichText;