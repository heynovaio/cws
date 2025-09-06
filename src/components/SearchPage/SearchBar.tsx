"use client";
import { useCategoryFilter } from "@/providers";
import { Field, Input, Label } from "@headlessui/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ lang }: { lang: string }) => {
  const { searchTerm, setSearchTerm } = useCategoryFilter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    // Just call setSearchTerm - URL will be updated automatically by the context
    setSearchTerm(newSearchTerm);
  };

  return (
    <Field className="flex gap-3 self-start md:self-auto w-full md:max-w-[400px]">
      <div className="flex items-center gap-2">
        <FaSearch className="h-5 w-5 text-aqua" />
        <Label htmlFor="search" className="label-small">
          {lang === "fr-ca" ? "Recherche" : "Search"}
        </Label>
      </div>
      <Input
        id="search"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={lang === "fr-ca" ? "Recherche..." : "Search..."}
        className={`bg-white px-4 py-1 rounded-full focus flex w-full`}
      />
    </Field>
  );
};
