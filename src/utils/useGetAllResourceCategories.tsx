import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { ResourceCategoryDocument } from "../../prismicio-types";

const fetchData = async (lang: string) => {
  const client = createClient();
  const response = await client.getAllByType("resource_category", { lang });
  return response as ResourceCategoryDocument[];
};

const GetAllResourceCategories = (lang: string) => {
  return useQuery({
    queryKey: [`resource-categories-${lang}`],
    queryFn: () => fetchData(lang),
  });
};

export default GetAllResourceCategories;
