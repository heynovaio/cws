"use client";
import { Container } from "../Layout";
import { DefaultCard } from "../Cards";
import { asText } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import {
  ProgramPageDocument,
  ResourcePageDocument,
} from "../../../prismicio-types";
import Link from "next/link";
import { useCategoryFilter } from "@/providers";
import { components, componentsTextSmall } from "@/utils";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useResourceCategoryData, useProgramCategoryData } from "@/hooks";
import { CustomPagination } from "../CustomPagination";
import { useState, useEffect, useMemo } from "react";

interface SearchGridProps {
  lang: string;
}

export const SearchGrid: React.FC<SearchGridProps> = ({ lang }) => {
  const { filteredItems } = useCategoryFilter();
  const { resourceCategoryData } = useResourceCategoryData(lang);
  const { programCategoryData } = useProgramCategoryData(lang);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems]);

  // Calculate paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredItems, itemsPerPage]);

  // Get category name for an item
  const getCategoryName = (
    item: ResourcePageDocument | ProgramPageDocument,
    lang: string = "en-ca"
  ) => {
    if (!item.data.category)
      return lang === "fr-ca" ? "Non classé" : "Uncategorized";

    // Handle resource category
    if (item.type === "resource_page" && "id" in item.data.category) {
      const category = resourceCategoryData?.find(
        (c) =>
          c.id ===
          ("id" in item.data.category ? item.data.category.id : undefined)
      );
      return category?.data?.name || (lang === "fr-ca" ? "Autre" : "Other");
    }

    // Handle program category
    if (item.type === "program_page" && "id" in item.data.category) {
      const category = programCategoryData?.find(
        (c) =>
          c.id ===
          ("id" in item.data.category ? item.data.category.id : undefined)
      );
      return category?.data?.name || (lang === "fr-ca" ? "Autre" : "Other");
    }

    return item.type === "program_page"
      ? lang === "fr-ca"
        ? "Programme"
        : "Program"
      : lang === "fr-ca"
        ? "Ressources"
        : "Resources";
  };

  return (
    <div className="padded-div" data-test-id="search-grid">
      <Container>
        {filteredItems.length > 0 ? (
          <CustomPagination
            itemsPerPage={paginatedItems.length}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-10"
          >
            {(
              filteredItems as (ResourcePageDocument | ProgramPageDocument)[]
            ).map((item, index) => (
              <DefaultCard
                key={`${item.id}-${index}`}
                title={asText(item.data.title)}
                content={
                  <PrismicRichText
                    field={item.data.body}
                    components={componentsTextSmall}
                  />
                }
                image={item.data.image}
                category={getCategoryName(item, lang)}
                cardType={item.type === "program_page" ? "program" : "resource"}
                buttons={[
                  <Link
                    key={index}
                    href={item.url ?? ""}
                    className="more-hover btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
                  >
                    {lang === "fr-ca" ? "En savoir plus" : "Learn More"}
                    <HiOutlineArrowLongRight className="h-10 w-10" />
                  </Link>,
                ]}
              />
            ))}
          </CustomPagination>
        ) : (
          <div className="text-center col-span-3 mx-auto md:w-1/2 my-24">
            <PrismicRichText
              field={[
                {
                  type: "paragraph",
                  text:
                    lang === "fr-ca"
                      ? "Aucun résultat trouvé"
                      : "No results found",
                  spans: [],
                },
              ]}
              components={components}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
