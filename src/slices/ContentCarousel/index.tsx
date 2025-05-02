"use client";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import {
  Section,
  Container,
  ContentBox,
  CarouselButton,
  DefaultCard,
} from "@/components";
import Carousel from "react-multi-carousel";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

import { components } from "@/utils";

/**
 * Props for `ContentCarousel`.
 */
export type ContentCarouselProps =
  SliceComponentProps<Content.ContentCarouselSlice>;

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 100,
  },
  tablet: {
    breakpoint: { max: 1023, min: 640 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 639, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

/**
 * Component for "ContentCarousel" Slices.
 */
const ContentCarousel = ({ slice }: ContentCarouselProps): JSX.Element => {
  const { data } = GetAllPrograms("en-ca");

  const contentCardIds = slice.primary.content_card.map(
    (item) => item.content.id
  );

  const filteredData = data?.filter((program: any) =>
    contentCardIds.includes(program.id)
  );

  console.log("Filtered Data:", filteredData);

  if (!data) {
    return null;
  }

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ContentBox
            title={slice.primary.title}
            content={
              <PrismicRichText
                field={slice.primary.body}
                components={components}
              />
            }
            width="standard"
          />
          <CarouselButton currentSlide={1} totalSlides={3} />
        </div>

        <Carousel
          responsive={responsive}
          partialVisible
          keyBoardControl
          arrows={false}
          itemClass="react-multi-carousel-item px-2"
          containerClass="lg:w-[1144px]"
        >
          {filteredData.map((item: any, index: number) => (
            <DefaultCard
              key={item.id}
              title={asText(item.data.title)}
              content={
                <PrismicRichText
                  field={item.data.body}
                  components={components}
                />
              }
              image={item.data.image}
              // category={
              //   item.data.category
              //     ? item.data.category.map((cat: any) => cat.text)
              //     : []
              // }
              cardType="program"
              buttons={item.data.cta_link ? [item.data.cta_link] : []}
            />
          ))}
        </Carousel>
        <p>Hello World</p>
      </Container>
    </Section>
  );
};

export default ContentCarousel;
