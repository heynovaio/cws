"use client";
import GetProgramCategoryById from "@/utils/useGetProgramCategoryById";

/*** 
This is the data handling hook for categories. Data is the response filled with every category page in the language specified. Error is the error message if the request fails. Do all the data handling for categories here like type conversions and useStates.
***/
export const useProgramCategoryDataById = (id: string[], lang: string) => {
  const { data: programCategoryData, error } = GetProgramCategoryById(id, lang);
  return {
    programCategoryData,
    error,
  };
};
