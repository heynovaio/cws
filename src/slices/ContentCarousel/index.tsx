"use client";

import { JSX, useRef, useState, useEffect } from "react";

import {
  asText,
  isFilled,
  Content,
  FilledContentRelationshipField,
  RichTextField,
} from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import Carousel, {
  CarouselInternalState,
  ResponsiveType,
} from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import {
  Button,
  Section,
  Container,
  ContentBox,
  CarouselButton,
  DefaultCard,
} from "@/components";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

import GetAllPrograms from "@/utils/useGetAllPrograms";
import GetAllResources from "../../utils/getAllResources";
import { useProgramCategoryData } from "@/hooks";
import { useResourceCategoryData } from "@/hooks";

import { components } from "@/utils";

export type ContentCarouselProps =
  SliceComponentProps<Content.ContentCarouselSlice>;

type ProgramDocument = Content.ProgramPageDocument;
type ResourceDocument = Content.ResourcePageDocument;
type PrismicItem = ProgramDocument | ResourceDocument;
type CategoryDocument =
  | Content.ProgramCategoryDocument
  | Content.ResourceCategoryDocument;

// Responsive config for react-multi-carousel
const responsive: ResponsiveType = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1023, min: 640 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 639, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

// Hook to determine how many items per slide based on screen size
function useItemsPerPage(responsive: ResponsiveType): number {
  const [items, setItems] = useState(responsive.desktop.items);

  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;

      for (const key in responsive) {
        const bp = responsive[key].breakpoint;
        if (width <= bp.max && width >= bp.min) {
          setItems(responsive[key].items);
          break;
        }
      }
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, [responsive]);

  return items;
}

const ContentCarousel = ({
  slice,
}: ContentCarouselProps): JSX.Element | null => {
  let data = null;
  let cardType = "";
  let categoryData = null;

  const carouselRef = useRef<Carousel>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = useItemsPerPage(responsive);

  const programPageData = GetAllPrograms("en-ca").data;
  const resourcePageData = GetAllResources("en-ca").data;
  const programCategoryData = useProgramCategoryData("en-ca");
  const resourceCategoryData = useResourceCategoryData("en-ca");

  // Sync current slide index
  const handleSlideChange = (_: unknown, state: CarouselInternalState) => {
    setCurrentSlide(state.currentSlide);
  };

  const contentCardIds = slice.primary.content_card
    .filter((item) => isFilled.contentRelationship(item.content))
    .map((item) => (item.content as FilledContentRelationshipField).id);

  if (slice.variation === "programsCarousel") {
    data = programPageData;
    cardType = "program";
    categoryData = programCategoryData;
  } else if (slice.variation === "resourceCarousel") {
    data = resourcePageData;
    cardType = "resource";
    categoryData = resourceCategoryData;
  }

  if (!data) return null;

  const filteredData: PrismicItem[] = data.filter((item) =>
    contentCardIds.includes(item.id)
  );

  const categoryList = categoryData
    ? "resourceCategoryData" in categoryData
      ? (categoryData.resourceCategoryData ?? [])
      : "programCategoryData" in categoryData
        ? (categoryData.programCategoryData ?? [])
        : []
    : [];

  const filteredDataWithCategory = filteredData.map((item: PrismicItem) => {
    const itemCategory = item.data?.category;

    const itemCategoryId = isFilled.contentRelationship(itemCategory)
      ? itemCategory.id
      : undefined;

    const matchedCategory = categoryList.find(
      (category: CategoryDocument) => category.id === itemCategoryId
    );

    const categoryName =
      matchedCategory?.data?.name ??
      (isFilled.contentRelationship(itemCategory)
        ? (itemCategory.data as { name?: string })?.name
        : undefined) ??
      "Other";

    return {
      ...item,
      categoryName,
    };
  });

  const totalSlides = Math.max(0, filteredData.length - itemsPerPage + 1);

  const handleArrowClick = (direction: "next" | "prev") => {
    if (direction === "next" && currentSlide < totalSlides - 1) {
      carouselRef.current?.next(1);
    } else if (direction === "prev" && currentSlide > 0) {
      carouselRef.current?.previous(1);
    }
  };

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        {/* Header and Carousel Navigation */}
        <div className="flex justify-between items-start mb-6">
          <ContentBox
            title={slice.primary.title ?? undefined}
            content={
              <PrismicRichText
                field={(slice.primary as { body?: RichTextField }).body}
                components={components}
              />
            }
            width="standard"
          />
          <CarouselButton
            currentSlide={currentSlide + 1}
            totalSlides={totalSlides}
            onSlideChange={handleArrowClick}
            styling="w-fit"
          />
        </div>

        {/* Carousel Content */}
        <Carousel
          ref={carouselRef}
          responsive={responsive}
          infinite={false}
          arrows={false}
          draggable
          swipeable
          keyBoardControl
          afterChange={handleSlideChange}
          itemClass="px-3 !mt-0"
          containerClass="w-full py-1"
        >
          {filteredDataWithCategory.map((item, index) => (
            <div key={item.id} className="carousel-card flex h-full">
              <DefaultCard
                title={asText(item.data.title)}
                content={
                  <PrismicRichText
                    field={item.data.body}
                    components={components}
                  />
                }
                category={item.categoryName as string}
                image={item.data.image}
                cardType={cardType}
                buttons={[
                  <Link
                    key={index}
                    href={item.url ?? ""}
                    className="btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
                  >
                    Learn More
                    <HiOutlineArrowLongRight className="h-10 w-10" />
                  </Link>,
                ]}
              />
            </div>
          ))}
        </Carousel>
        {slice.primary.redirect_button?.[0] && (
          <div className="mt-10">
            <Button
              key={slice.id}
              buttonType="primary"
              label={
                typeof slice.primary.redirect_button[0]?.url === "object" &&
                "text" in slice.primary.redirect_button[0]?.url
                  ? slice.primary.redirect_button[0]?.url.text
                  : "Learn More"
              }
              buttonLink={slice.primary.redirect_button[0]?.url ?? "#"}
            />
          </div>
        )}
      </Container>
    </Section>
  );
};

export default ContentCarousel;
