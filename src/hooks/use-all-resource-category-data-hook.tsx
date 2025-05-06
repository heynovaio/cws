"use client";
import GetAllResourceCategories from "@/utils/useGetAllResourceCategories";

/*** 
This is the data handling hook for categories. Data is the response filled with every category page in the language specified. Error is the error message if the request fails. Do all the data handling for categories here like type conversions and useStates.
***/
export const useResourceCategoryData = (lang: string) => {
  const { data: resourceCategoryData, error } = GetAllResourceCategories(lang);
  return {
    resourceCategoryData,
    error,
  };
};
