"use client";
import GetNewsletterSignup from "@/utils/useGetNewsletterSignup";

/*** 
This is the data handling hook for categories. Data is the response filled with every category page in the language specified. Error is the error message if the request fails. Do all the data handling for categories here like type conversions and useStates.
***/
export const useNewsletterSignupData = (lang: string) => {
  const {
    data: newsletterSignupData,
    isLoading,
    error,
  } = GetNewsletterSignup(lang);

  return {
    newsletterSignupData,
    isLoading,
    error,
  };
};
