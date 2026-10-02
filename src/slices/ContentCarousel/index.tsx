"use client";

import { JSX, useRef, useState, useEffect } from "react";

import {
  asText,
  isFilled,
  Content,
  FilledContentRelationshipField,
  RichTextField,
} from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";

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
  ShortCard,
} from "@/components";
import type { CardStyle } from "@/components/Cards/DefaultCard";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

import GetAllPrograms from "@/utils/useGetAllPrograms";
import GetAllResources from "../../utils/getAllResources";
import { useProgramCategoryData } from "@/hooks";
import { useResourceCategoryData } from "@/hooks";

import { components } from "@/utils";
import { PageDocument } from "../../../prismicio-types";
import { useLang } from "@/utils/getLang";

export type ContentCarouselProps =
  SliceComponentProps<Content.ContentCarouselSlice>;

type ProgramDocument = Content.ProgramPageDocument;
type ResourceDocument = Content.ResourcePageDocument;
type PrismicItem = ProgramDocument | ResourceDocument | PageDocument;
type CategoryDocument =
  Content.ProgramCategoryDocument | Content.ResourceCategoryDocument;

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

  const lang = useLang().routeLocale;
  const learnMoreText = lang === "fr-ca" ? "En savoir plus" : "Learn More";

  const programPageData = GetAllPrograms(lang).data;
  const resourcePageData = GetAllResources(lang).data;
  const programCategoryData = useProgramCategoryData(lang);
  const resourceCategoryData = useResourceCategoryData(lang);

  const handleSlideChange: (
    _: unknown,
    state: CarouselInternalState
  ) => void = (_, state) => {
    setCurrentSlide(state.currentSlide);
  };

  const handleArrowClick = (direction: "next" | "prev") => {
    if (direction === "next") {
      carouselRef.current?.next(1);
    } else {
      carouselRef.current?.previous(1);
    }
  };

  if (slice.variation === "manualCarousel") {
    const manualCards = slice.items ?? [];
    const totalSlidesManual = Math.max(
      0,
      manualCards.length - itemsPerPage + 1
    );

    return (
      <Section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        styling="overflow-x-hidden"
        backgroundColor={slice.primary.background_color}
      >
        <Container>
          <div className="flex justify-between items-center mb-6">
            <ContentBox title={slice.primary.title ?? undefined} width="full" />
            {manualCards.length > itemsPerPage && (
              <CarouselButton
                currentSlide={currentSlide + 1}
                totalSlides={totalSlidesManual}
                onSlideChange={handleArrowClick}
                styling="w-fit"
              />
            )}
          </div>
        </Container>
        <Container>
          <Carousel
            ref={carouselRef}
            responsive={responsive}
            infinite={false}
            arrows={false}
            draggable
            swipeable
            keyBoardControl
            afterChange={handleSlideChange}
            containerClass="content-carousel"
            itemClass="react-multi-carousel-item !mt-0 flex"
          >
            {manualCards.map((item, index) => {
              const cardStyle =
                (item.card_style?.toLowerCase() as CardStyle) ?? "white";
              const linkHref = isFilled.link(item.link) ? item.link : null;

              return (
                <div
                  key={index}
                  className="flex h-full w-full p-3 overflow-visible"
                >
                  <DefaultCard
                    title=""
                    content={
                      <PrismicRichText
                        field={item.description}
                        components={components}
                      />
                    }
                    image={isFilled.image(item.image) ? item.image : undefined}
                    cardType="manual"
                    cardStyle={cardStyle}
                    buttons={
                      linkHref
                        ? [
                            <Link
                              key={index}
                              href={linkHref.url ?? ""}
                              target={
                                "target" in linkHref
                                  ? (linkHref.target ?? undefined)
                                  : undefined
                              }
                              className="more-hover btn pl-0 flex flex-row items-center gap-2 underline underline-offset-4"
                            >
                              <span>{linkHref.text || learnMoreText}</span>
                              <HiOutlineArrowLongRight className="h-10 w-10" />
                            </Link>,
                          ]
                        : undefined
                    }
                  />
                </div>
              );
            })}
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
                    : learnMoreText
                }
                buttonLink={slice.primary.redirect_button[0]?.url ?? "#"}
              />
            </div>
          )}
        </Container>
      </Section>
    );
  }

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
      (lang === "fr-ca" ? "Autre" : "Other");

    return { ...item, categoryName };
  });

  const totalSlides = Math.max(0, filteredData.length - itemsPerPage + 1);
  const hasPhoto = slice.primary.photo == true;

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      styling="overflow-x-hidden"
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <div className="flex justify-between items-center mb-6">
          <ContentBox
            title={slice.primary.title ?? undefined}
            content={
              <PrismicRichText
                field={(slice.primary as { body?: RichTextField }).body}
                components={components}
              />
            }
            width="full"
          />
          {filteredDataWithCategory.length > itemsPerPage && (
            <CarouselButton
              currentSlide={currentSlide + 1}
              totalSlides={totalSlides}
              onSlideChange={handleArrowClick}
              styling="w-fit"
            />
          )}
        </div>
      </Container>
      <Container>
        <Carousel
          ref={carouselRef}
          responsive={responsive}
          infinite={false}
          arrows={false}
          draggable
          swipeable
          keyBoardControl
          afterChange={handleSlideChange}
          containerClass="content-carousel"
          itemClass="react-multi-carousel-item !mt-0 flex "
        >
          {filteredDataWithCategory.map((item, index) => (
            <div
              key={item.id}
              className="flex h-full w-full p-3 overflow-visible"
            >
              {hasPhoto ? (
                <DefaultCard
                  title={asText(item.data.title)}
                  content={
                    <PrismicRichText
                      field={item.data.body}
                      components={components}
                    />
                  }
                  category={item.categoryName as string}
                  image={
                    item.data.image &&
                    "Carousel Thumbnail" in item.data.image &&
                    item.data.image["Carousel Thumbnail"]?.url
                      ? item.data.image["Carousel Thumbnail"]
                      : item.data.image
                  }
                  cardType={
                    slice.variation === "programsCarousel"
                      ? "program"
                      : "resource"
                  }
                  buttons={[
                    <Link
                      key={index}
                      href={item.url ?? ""}
                      className="more-hover btn pl-0 flex flex-row items-center gap-2 underline underline-offset-4"
                    >
                      <span>{learnMoreText}</span>
                      <HiOutlineArrowLongRight className="h-10 w-10" />
                    </Link>,
                  ]}
                />
              ) : (
                <ShortCard
                  title={asText(item.data.title)}
                  category={item.categoryName as string}
                  cardType={cardType}
                  buttons={[
                    <Link
                      key={index}
                      href={item.url ?? ""}
                      className="more-hover btn p-0 flex flex-row items-center gap-2 focus:outline-offset-4"
                    >
                      <span>{learnMoreText}</span>
                      <HiOutlineArrowLongRight className="h-7 w-7" />
                    </Link>,
                  ]}
                />
              )}
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
                  : learnMoreText
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
