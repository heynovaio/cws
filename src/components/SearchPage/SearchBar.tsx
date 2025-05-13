"use client";
import { useCategoryFilter } from "@/providers";
import { Field, Input, Label } from "@headlessui/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useCategoryFilter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Field className="flex items-center gap-2">
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
        className={`bg-white px-4 py-1 rounded-full focus flex-grow`}
      />
    </Field>
  );
};
