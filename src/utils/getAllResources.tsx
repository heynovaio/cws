import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { ResourcePageDocument } from "../../prismicio-types";

const fetchData = async (lang: string) => {
  const client = createClient();
  const response = await client.getAllByType("resource_page", { lang });
  return response as ResourcePageDocument[];
};

const GetAllResources = (lang: string) => {
  return useQuery({
    queryKey: [`resources-${lang}`],
    queryFn: () => fetchData(lang),
  });
};

export default GetAllResources;
