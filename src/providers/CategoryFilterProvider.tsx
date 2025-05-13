"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import Fuse from "fuse.js";
import {
  ResourcePageDocument,
  ProgramPageDocument,
  ResourceCategoryDocument,
  ProgramCategoryDocument,
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
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  clearAllFilters: () => void;
  selectedResourceCategories: string[];
  setSelectedResourceCategories: (categoryIds: string[]) => void;
  toggleResourceCategory: (categoryId: string) => void;
  resourceCategories: ResourceCategoryDocument[];
  setResourceCategories: (categories: ResourceCategoryDocument[]) => void;
  selectedProgramCategories: string[];
  setSelectedProgramCategories: (categoryIds: string[]) => void;
  toggleProgramCategory: (categoryId: string) => void;
  programCategories: ProgramCategoryDocument[];
  setProgramCategories: (categories: ProgramCategoryDocument[]) => void;
  availableTags: string[];
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
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>(
    defaultCategoryFilter
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedResourceCategories, setSelectedResourceCategories] = useState<
    string[]
  >([]);
  const [selectedProgramCategories, setSelectedProgramCategories] = useState<
    string[]
  >([]);
  const [resourceCategories, setResourceCategories] = useState<
    ResourceCategoryDocument[]
  >([]);
  const [programCategories, setProgramCategories] = useState<
    ProgramCategoryDocument[]
  >([]);

  // Extract all tags from resources and programs
  const resourceTags = useMemo(() => {
    return Array.from(
      new Set(resources.flatMap((resource) => resource.tags || []))
    ).sort();
  }, [resources]);

  const programTags = useMemo(() => {
    return Array.from(
      new Set(programs.flatMap((program) => program.tags || []))
    ).sort();
  }, [programs]);

  const allTags = useMemo(() => {
    return Array.from(new Set([...resourceTags, ...programTags])).sort();
  }, [resourceTags, programTags]);

  // Determine available tags based on active filter
  const availableTags = useMemo(() => {
    switch (activeFilter) {
      case "resource_page":
        return resourceTags;
      case "program_page":
        return programTags;
      case "all":
      default:
        return allTags;
    }
  }, [activeFilter, resourceTags, programTags, allTags]);

  const toggleResourceCategory = useCallback((categoryId: string) => {
    setSelectedResourceCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const toggleProgramCategory = useCallback((categoryId: string) => {
    setSelectedProgramCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSetResourceCategories = useCallback((categoryIds: string[]) => {
    setSelectedResourceCategories(categoryIds);
  }, []);

  const handleSetProgramCategories = useCallback((categoryIds: string[]) => {
    setSelectedProgramCategories(categoryIds);
  }, []);

  const toggleTag = useCallback(
    (tag: string) => {
      // Only allow toggling if the tag is in availableTags
      if (availableTags.includes(tag)) {
        setSelectedTags((prev) =>
          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
      }
    },
    [availableTags]
  );

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setActiveFilter(defaultCategoryFilter);
    setSelectedTags([]);
    setSelectedResourceCategories([]);
    setSelectedProgramCategories([]);
  }, []);

  // Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: "title", weight: 0.6 },
        { name: "description", weight: 0.3 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
    }),
    []
  );

  // Prepare data for Fuse.js
  const searchableItems = useMemo(() => {
    return [...programs, ...resources].map((item) => ({
      id: item.id,
      type: item.type,
      title: asText(item.data.title) || "",
      description: asText(item.data.body) || "",
      tags: item.tags || [],
      originalItem: item,
    }));
  }, [programs, resources]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(searchableItems, fuseOptions);
  }, [searchableItems, fuseOptions]);

  // Fuzzy search function
  const fuzzySearch = useCallback(
    (term: string) => {
      if (!term.trim()) return searchableItems.map((item) => item.originalItem);
      const results = fuse.search(term);
      return results.map((result) => result.item.originalItem);
    },
    [fuse, searchableItems]
  );

  // Main filtering logic
  const filteredItems = useMemo(() => {
    // Start with all items based on active filter
    let items: (ResourcePageDocument | ProgramPageDocument)[] = [];

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

    // Apply search filter if search term exists
    if (searchTerm) {
      items = fuzzySearch(searchTerm).filter((item) =>
        items.some((i) => i.id === item.id)
      );
    }

    // Check if we have any category or tag filters
    const hasResourceCategoryFilter = selectedResourceCategories.length > 0;
    const hasProgramCategoryFilter = selectedProgramCategories.length > 0;
    const hasTagFilter = selectedTags.length > 0;
    const hasAnyFilter =
      hasResourceCategoryFilter || hasProgramCategoryFilter || hasTagFilter;

    if (hasAnyFilter) {
      items = items.filter((item) => {
        // Check category matches
        const matchesResourceCategory =
          item.type === "resource_page" &&
          hasResourceCategoryFilter &&
          item.data.category &&
          selectedResourceCategories.includes(
            item.data.category && "id" in item.data.category
              ? item.data.category.id
              : ""
          );

        const matchesProgramCategory =
          item.type === "program_page" &&
          hasProgramCategoryFilter &&
          item.data.category &&
          selectedProgramCategories.includes(
            item.data.category && "id" in item.data.category
              ? item.data.category.id
              : ""
          );

        // Check tag matches
        const matchesTags =
          hasTagFilter && item.tags
            ? selectedTags.some((tag) => item.tags?.includes(tag))
            : false;

        // Return true if any of the filters match (OR logic)
        return matchesResourceCategory || matchesProgramCategory || matchesTags;
      });
    }

    return items;
  }, [
    activeFilter,
    programs,
    resources,
    searchTerm,
    fuzzySearch,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedTags,
  ]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: programs.length + resources.length,
      program_page: programs.length,
      resource_page: resources.length,
    };
  }, [programs, resources]);

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
    resultCount: filteredItems.length,
    selectedTags,
    toggleTag,
    allTags,
    clearAllFilters,
    selectedResourceCategories,
    setSelectedResourceCategories: handleSetResourceCategories,
    toggleResourceCategory,
    resourceCategories,
    setResourceCategories,
    selectedProgramCategories,
    setSelectedProgramCategories: handleSetProgramCategories,
    toggleProgramCategory,
    programCategories,
    setProgramCategories,
    availableTags,
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
