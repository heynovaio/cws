"use client";
import { useCategoryFilter } from "@/providers";
import { Field, Input, Label } from "@headlessui/react";
import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useCategoryFilter();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlSearchTerm = searchParams?.get("searchTerm") || "";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams, searchTerm, setSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchTerm) {
      newSearchParams.set("searchTerm", newSearchTerm);
    } else {
      newSearchParams.delete("searchTerm");
    }
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <Field className="flex gap-3 self-start md:self-auto w-full md:max-w-[400px]">
      <div className="flex items-center gap-2">
        <FaSearch className="h-5 w-5 text-aqua" />
        <Label htmlFor="search" className="label-small">
          Search
        </Label>
      </div>
      <Input
        id="search"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        className={`bg-white px-4 py-1 rounded-full focus flex w-full`}
      />
    </Field>
  );
};
