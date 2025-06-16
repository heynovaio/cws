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
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ModuleFilter, ProgramFormat } from "@/constants";

interface SearchGridProps {
  lang: string;
}

export const SearchGrid: React.FC<SearchGridProps> = ({ lang }) => {
  const {
    filteredItems,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    selectedResourceCategories,
    setSelectedResourceCategories,
    selectedProgramCategories,
    setSelectedProgramCategories,
    selectedFormats,
    setSelectedFormats,
    hasCredentials,
    setHasCredentials,
    maxCostFilter,
    setMaxCostFilter,
    maxCost,
  } = useCategoryFilter();

  const { resourceCategoryData } = useResourceCategoryData(lang);
  const { programCategoryData } = useProgramCategoryData(lang);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const itemsPerPage = 6;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from URL params on first load
  useEffect(() => {
    if (
      !isInitialized &&
      (resourceCategoryData?.length || programCategoryData?.length)
    ) {
      const searchParam = searchParams.get("search");
      const filterParam = searchParams.get("filter");
      const resourceCategoriesParam = searchParams.get("resourceCategories");
      const programCategoriesParam = searchParams.get("programCategories");
      const formatsParam = searchParams.get("formats");
      const credentialsParam = searchParams.get("credentials");
      const maxCostParam = searchParams.get("maxCost");
      const pageParam = searchParams.get("page");

      // Apply filters from URL
      if (searchParam) {
        setSearchTerm(searchParam);
      }

      if (
        filterParam &&
        ["all", "program_page", "resource_page"].includes(filterParam)
      ) {
        setActiveFilter(filterParam as ModuleFilter);
      }

      if (resourceCategoriesParam) {
        const categories = resourceCategoriesParam.split(",").filter(Boolean);
        setSelectedResourceCategories(categories);
      }

      if (programCategoriesParam) {
        const categories = programCategoriesParam.split(",").filter(Boolean);
        setSelectedProgramCategories(categories);
      }

      if (formatsParam) {
        const formats = formatsParam.split(",").filter(Boolean);
        setSelectedFormats(formats as ProgramFormat[]);
      }

      if (credentialsParam === "true") {
        setHasCredentials(true);
      }

      if (maxCostParam) {
        const cost = parseInt(maxCostParam, 10);
        if (!isNaN(cost)) {
          setMaxCostFilter(cost);
        }
      }

      // Set page from URL
      if (pageParam) {
        const page = parseInt(pageParam, 10);
        if (page > 0) {
          setCurrentPage(page);
        }
      }

      setIsInitialized(true);
    }
  }, [
    searchParams,
    resourceCategoryData,
    programCategoryData,
    isInitialized,
    setSearchTerm,
    setActiveFilter,
    setSelectedResourceCategories,
    setSelectedProgramCategories,
    setSelectedFormats,
    setHasCredentials,
    setMaxCostFilter,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (isInitialized) {
      setCurrentPage(1);
    }
  }, [filteredItems, isInitialized]);

  // Update URL when filters or page change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    // Add current filters to URL
    if (searchTerm) params.set("search", searchTerm);
    if (activeFilter !== "all") params.set("filter", activeFilter);
    if (selectedResourceCategories.length > 0) {
      params.set("resourceCategories", selectedResourceCategories.join(","));
    }
    if (selectedProgramCategories.length > 0) {
      params.set("programCategories", selectedProgramCategories.join(","));
    }
    if (selectedFormats.length > 0) {
      params.set("formats", selectedFormats.join(","));
    }
    if (hasCredentials) params.set("credentials", "true");
    if (maxCostFilter !== maxCost && maxCost > 0) {
      params.set("maxCost", maxCostFilter.toString());
    }
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newURL = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newURL, { scroll: false });
  }, [
    searchTerm,
    activeFilter,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
    currentPage,
    pathname,
    router,
  ]);

  useEffect(() => {
    if (isInitialized) {
      updateURL();
    }
  }, [
    isInitialized,
    searchTerm,
    activeFilter,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
    currentPage,
    updateURL,
  ]);

  // Calculate paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredItems, itemsPerPage]);

  // Get category name for an item
  const getCategoryName = (
    item: ResourcePageDocument | ProgramPageDocument
  ) => {
    if (!item.data.category) return "Uncategorized";

    // Handle resource category
    if (item.type === "resource_page" && "id" in item.data.category) {
      const category = resourceCategoryData?.find(
        (c) =>
          c.id ===
          ("id" in item.data.category ? item.data.category.id : undefined)
      );
      return category?.data?.name || "Other";
    }

    // Handle program category
    if (item.type === "program_page" && "id" in item.data.category) {
      const category = programCategoryData?.find(
        (c) =>
          c.id ===
          ("id" in item.data.category ? item.data.category.id : undefined)
      );
      return category?.data?.name || "Other";
    }

    return item.type === "resource_page" ? "Resource" : "Program";
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
              paginatedItems as (ResourcePageDocument | ProgramPageDocument)[]
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
                category={getCategoryName(item)}
                cardType={
                  item.type === "resource_page" ? "resource" : "program"
                }
                buttons={[
                  <Link
                    key={index}
                    href={item.url ?? ""}
                    className="more-hover btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
                  >
                    Learn More
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
                { type: "paragraph", text: "No results found", spans: [] },
              ]}
              components={components}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
