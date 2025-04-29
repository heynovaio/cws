import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { ProgramCategoryDocument } from "../../prismicio-types";

const fetchData = async (lang: string) => {
  const client = createClient();
  const response = await client.getAllByType("program_category", { lang });
  return response as ProgramCategoryDocument[];
};

const GetAllProgramCategories = (lang: string) => {
  return useQuery({
    queryKey: [`program-categories-${lang}`],
    queryFn: () => fetchData(lang),
  });
};

export default GetAllProgramCategories;
