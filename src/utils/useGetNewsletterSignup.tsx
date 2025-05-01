import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { NewsletterSignupDocument } from "../../prismicio-types";

/**
 * Fetches the newsletter_signup single custom type from Prismic.
 */
const fetchData = async (lang: string): Promise<NewsletterSignupDocument> => {
  const client = createClient();
  const response = await client.getSingle("newsletter_signup", { lang });
  return response as NewsletterSignupDocument;
};

/**
 * React Query hook to get the newsletter signup content.
 */
const GetNewsletterSignup = (lang: string) => {
  return useQuery({
    queryKey: ["newsletter-signup", lang],
    queryFn: () => fetchData(lang),
  });
};

export default GetNewsletterSignup;
