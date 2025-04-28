// hooks/useCategoryFilterData.ts
import { Content } from "@prismicio/client";
import { usePrismicDocumentsByType } from "@prismicio/react";

type CategoryType = "program" | "resource";

export const useCategoryFilterData = (
  lang: string,
  categoryType: CategoryType
) => {
  // Determine the document type based on category type
  const categoryDocType = `${categoryType}_category`;

  // Fetch all categories of the specified type
  const [categories] = usePrismicDocumentsByType<
    Content.ProgramCategoryDocument | Content.ResourceCategoryDocument
  >(categoryDocType, { lang });

  // Fetch all programs or resources based on category type
  const [contentItems] = usePrismicDocumentsByType(
    categoryType === "program" ? "program" : "resource",
    { lang }
  );

  // Map categories to their related content
  const categoriesWithContent = categories?.results.map((category) => {
    const relatedItems =
      contentItems?.results.filter((item) =>
        item.data.categories.some(
          (cat: { category: { id: string } }) => cat.category.id === category.id
        )
      ) || [];

    return {
      ...category,
      relatedItems,
    };
  });

  return {
    categories: categoriesWithContent || [],
    isLoading: !categories || !contentItems,
    categoryType,
  };
};
