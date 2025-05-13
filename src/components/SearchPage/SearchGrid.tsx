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

interface SearchGridProps {
  lang: string;
}

export const SearchGrid: React.FC<SearchGridProps> = ({ lang }) => {
  const { filteredItems } = useCategoryFilter();
  const { resourceCategoryData } = useResourceCategoryData(lang);
  const { programCategoryData } = useProgramCategoryData(lang);

  console.log("Filtered items:", filteredItems);
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
          <CustomPagination itemsPerPage={6} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-10">
            {(
              filteredItems as (ResourcePageDocument | ProgramPageDocument)[]
            ).map((item, index) => (
              <DefaultCard
                key={index}
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
                    className="btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
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
