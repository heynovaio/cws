import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { CareerPageDocument } from "../../prismicio-types";

const fetchData = async (lang: string) => {
  const client = createClient();
  const response = await client.getAllByType("career_page", { lang });
  return response as CareerPageDocument[];
};

const GetAllCareers = (lang: string) => {
  return useQuery({
    queryKey: [`career-${lang}`],
    queryFn: () => fetchData(lang),
  });
};

export default GetAllCareers;
