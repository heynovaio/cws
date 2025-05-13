import {
  ProgramPageDocument,
  ResourcePageDocument,
} from "../../prismicio-types";
export const getCategoryName = (
  item: ResourcePageDocument | ProgramPageDocument,
  resourceCategoryData?: ResourcePageDocument[],
  programCategoryData?: ProgramPageDocument[]
) => {
  if (!item.data.category) return "Uncategorized";

  // Handle resource category
  if (item.type === "resource_page" && "id" in item.data.category) {
    const category = resourceCategoryData?.find(
      (c) => "id" in item.data.category && c.id === item.data.category.id
    );
    return category?.data?.title || "Other";
  }

  // Handle program category
  if (item.type === "program_page" && "id" in item.data.category) {
    const category = programCategoryData?.find(
      (c) => "id" in item.data.category && c.id === item.data.category.id
    );
    return category?.data?.title || "Other";
  }

  return item.type === "resource_page" ? "Resource" : "Program";
};
