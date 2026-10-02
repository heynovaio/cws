import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";

const fetchAllTags = async (lang: string) => {
  const client = createClient();

  const [resources, programs] = await Promise.all([
    client.getAllByType("resource_page", { lang }),
    client.getAllByType("program_page", { lang }),
  ]);

  const resourceTags = new Set<string>();
  const programTags = new Set<string>();

  resources.forEach((doc) => doc.tags?.forEach((tag) => resourceTags.add(tag)));
  programs.forEach((doc) => doc.tags?.forEach((tag) => programTags.add(tag)));

  return {
    resourceTags: Array.from(resourceTags).sort(),
    programTags: Array.from(programTags).sort(),
    allTags: Array.from(new Set([...resourceTags, ...programTags])).sort(),
  };
};

const useAllTags = (lang: string) => {
  return useQuery({
    queryKey: [`all-tags-${lang}`],
    queryFn: () => fetchAllTags(lang),
  });
};

export default useAllTags;
