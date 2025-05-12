"use client";
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  ResourcePageDocument,
  ProgramPageDocument,
} from "../../prismicio-types";
import { ModuleFilter } from "@/constants";
import { asText } from "@prismicio/client";

interface CategoryFilterContextProps {
  resources: ResourcePageDocument[];
  setResources: (resources: ResourcePageDocument[]) => void;
  programs: ProgramPageDocument[];
  setPrograms: (programs: ProgramPageDocument[]) => void;
  activeFilter: ModuleFilter;
  setActiveFilter: (filter: ModuleFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: (ResourcePageDocument | ProgramPageDocument)[];
  filterCounts: Record<ModuleFilter, number>;
  resultCount: number;
}

const CategoryFilterContext = createContext<
  CategoryFilterContextProps | undefined
>(undefined);

export const defaultCategoryFilter: ModuleFilter = "all";

const CategoryFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resources, setResources] = useState<ResourcePageDocument[]>([]);
  const [programs, setPrograms] = useState<ProgramPageDocument[]>([]);
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>(defaultCategoryFilter);
  const [searchTerm, setSearchTerm] = useState("");

  // Search through an item's text fields
  const matchesSearchTerm = useCallback(
    (item: ResourcePageDocument | ProgramPageDocument) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      // Check title (adjust based on your actual data structure)
      if (asText(item.data.title)?.toLowerCase().includes(searchLower)) return true;
      
      // Check description (adjust based on your actual data structure)
      if (asText(item.data.body)?.toLowerCase().includes(searchLower)) return true;
      
      return false;
    },
    [searchTerm]
  );

  // Calculate filtered items based on active filter AND search term
  const filteredItems = useMemo(() => {
    let items: (ResourcePageDocument | ProgramPageDocument)[] = [];
    
    // First filter by category
    switch (activeFilter) {
      case "program_page":
        items = programs;
        break;
      case "resource_page":
        items = resources;
        break;
      case "all":
      default:
        items = [...programs, ...resources];
    }
    
    // Then filter by search term if one exists
    if (searchTerm) {
      return items.filter(matchesSearchTerm);
    }
    
    return items;
  }, [activeFilter, matchesSearchTerm, programs, resources, searchTerm]);

  // Calculate counts for each filter (excluding search)
  const filterCounts = useMemo(() => ({
    all: programs.length + resources.length,
    program_page: programs.length,
    resource_page: resources.length,
  }), [programs, resources]);

  // Count of actual results after all filtering
  const resultCount = filteredItems.length;

  const value = {
    resources,
    setResources,
    programs,
    setPrograms,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    filteredItems,
    filterCounts,
    resultCount,
  };

  return (
    <CategoryFilterContext.Provider value={value}>
      {children}
    </CategoryFilterContext.Provider>
  );
};

export default CategoryFilterProvider;

export const useCategoryFilter = (): CategoryFilterContextProps => {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error(
      "useCategoryFilter must be used within a CategoryFilterProvider"
    );
  }
  return context;
};