"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import Fuse from "fuse.js";
import {
  ResourcePageDocument,
  ProgramPageDocument,
  ResourceCategoryDocument,
  ProgramCategoryDocument,
} from "../../prismicio-types";
import { ModuleFilter, ProgramFormat } from "@/constants";
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
  selectedFormats: ProgramFormat[];
  setSelectedFormats: (formats: ProgramFormat[]) => void;
  toggleFormat: (format: ProgramFormat) => void;
  hasCredentials: boolean;
  setHasCredentials: (value: boolean) => void;
  toggleCredentials: () => void;
  costRange: [number, number];
  setCostRange: (range: [number, number]) => void;
  maxCost: number;
  resetCostRange: () => void;
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
  const [_activeFilter, _setActiveFilter] = useState<ModuleFilter>(
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
  const [selectedFormats, setSelectedFormats] = useState<ProgramFormat[]>([]);
  const [hasCredentials, setHasCredentials] = useState<boolean>(false);
  const [costRange, setCostRange] = useState<[number, number]>([0, 0]);

  // Calculate max cost from programs
  const maxCost = useMemo(() => {
    if (programs.length === 0) return 0;
    return Math.max(...programs.map((program) => program.data.cost || 0));
  }, [programs]);

  useEffect(() => {
    if (programs.length > 0 && costRange[1] === 0) {
      setCostRange([0, maxCost]);
    }
  }, [programs, maxCost, costRange]);

  const resetCostRange = useCallback(() => {
    setCostRange([0, maxCost]);
  }, [maxCost]);

  const toggleCredentials = useCallback(() => {
    setHasCredentials((prev) => !prev);
  }, []);

  const toggleFormat = useCallback((format: ProgramFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  }, []);

  const setActiveFilter = useCallback(
    (filter: ModuleFilter) => {
      if (_activeFilter === "program_page" && filter !== "program_page") {
        setSelectedFormats([]);
        setHasCredentials(false);
        setCostRange([0, maxCost]);
      }
      _setActiveFilter(filter);
    },
    [_activeFilter, maxCost]
  );
  const activeFilter = _activeFilter;

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
    setSelectedFormats([]);
    setHasCredentials(false);
    setCostRange([0, maxCost]);
  }, [maxCost, setActiveFilter]);

  // Fuse.js
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

  const fuse = useMemo(() => {
    return new Fuse(searchableItems, fuseOptions);
  }, [searchableItems, fuseOptions]);

  const fuzzySearch = useCallback(
    (term: string) => {
      if (!term.trim()) return searchableItems.map((item) => item.originalItem);
      const results = fuse.search(term);
      return results.map((result) => result.item.originalItem);
    },
    [fuse, searchableItems]
  );

  // Filtering logic
  const filteredItems = useMemo(() => {
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

    // Only apply other filters if any are active
    if (
      selectedTags.length > 0 ||
      selectedResourceCategories.length > 0 ||
      selectedProgramCategories.length > 0 ||
      selectedFormats.length > 0 ||
      hasCredentials ||
      ((costRange[0] !== 0 || costRange[1] !== maxCost) &&
        activeFilter !== "resource_page") // Only apply cost filter if not viewing resources
    ) {
      items = items.filter((item) => {
        // Resource category check
        const matchesResourceCategory =
          item.type === "resource_page" &&
          selectedResourceCategories.length > 0 &&
          item.data.category &&
          selectedResourceCategories.includes(
            "id" in item.data.category ? item.data.category.id : ""
          );

        // Program category check
        const matchesProgramCategory =
          item.type === "program_page" &&
          selectedProgramCategories.length > 0 &&
          item.data.category &&
          selectedProgramCategories.includes(
            "id" in item.data.category ? item.data.category.id : ""
          );

        // Tag check
        const matchesTags =
          selectedTags.length > 0 && item.tags
            ? selectedTags.some((tag) => item.tags?.includes(tag))
            : false;

        // Format check - only for programs with format specified
        const matchesFormat =
          item.type === "program_page" &&
          selectedFormats.length > 0 &&
          item.data.format &&
          selectedFormats.includes(item.data.format);

        const matchesCredentials =
          hasCredentials &&
          item.type === "program_page" &&
          item.data.certs === true;

        // Only apply cost filter to programs or when viewing all items
        const matchesCostRange =
          item.type === "program_page" &&
          typeof item.data.cost === "number" &&
          item.data.cost >= costRange[0] &&
          item.data.cost <= costRange[1];

        return (
          matchesResourceCategory ||
          matchesProgramCategory ||
          matchesTags ||
          matchesFormat ||
          matchesCredentials ||
          (matchesCostRange && activeFilter !== "resource_page")
        );
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
    selectedFormats,
    hasCredentials,
    costRange,
    maxCost,
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
    selectedFormats,
    setSelectedFormats,
    toggleFormat,
    hasCredentials,
    setHasCredentials,
    toggleCredentials,
    costRange,
    setCostRange,
    maxCost,
    resetCostRange,
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
