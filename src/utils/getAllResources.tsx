import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { ResourcePageDocument, PageDocument } from "../../prismicio-types";

const fetchData = async (lang: string) => {
  const client = createClient();

  const [resourcePages, pages] = await Promise.all([
    client.getAllByType("resource_page", { lang }) as Promise<
      ResourcePageDocument[]
    >,
    client.getAllByType("page", { lang }) as Promise<PageDocument[]>,
  ]);

  const filteredPages = pages.filter((page) => {
    const category = page.data.category;
    const hasCategory =
      category &&
      "id" in category &&
      typeof category.id === "string" &&
      category.id.length > 0;

    return hasCategory;
  });

  return [...resourcePages, ...filteredPages];
};

const GetAllResources = (lang: string) => {
  return useQuery({
    queryKey: [`resources-and-pages-${lang}`],
    queryFn: () => fetchData(lang),
  });
};

export default GetAllResources;
