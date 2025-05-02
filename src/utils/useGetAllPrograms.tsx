import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/prismicio";
import { ProgramPageDocument } from "../../prismicio-types";

const fetchData = async (lang: string) => {
  const client = createClient();
  const response = await client.getAllByType("program_page", { lang });
  return response as ProgramPageDocument[];
};

const GetAllPrograms = (lang: string) => {
  return useQuery({
    queryKey: [`programs-${lang}`],
    queryFn: () => fetchData(lang),
  });
};

export default GetAllPrograms;
