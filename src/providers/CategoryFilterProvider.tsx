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
import { ModuleFilter, PROGRAM_FORMATS, ProgramFormat } from "@/constants";
import { asText } from "@prismicio/client";
import { useSearchParams } from "next/navigation";

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
  maxCostFilter: number;
  setMaxCostFilter: (value: number) => void;
  maxCost: number;
  resetCostFilter: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const CategoryFilterContext = createContext<
  CategoryFilterContextProps | undefined
>(undefined);

export const defaultCategoryFilter: ModuleFilter = "all";

const CategoryFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const [resources, setResources] = useState<ResourcePageDocument[]>([]);
  const [programs, setPrograms] = useState<ProgramPageDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const urlTags = searchParams.get("tags")?.split(",") || [];
    return urlTags;
  });
  const [_activeFilter, _setActiveFilter] = useState<ModuleFilter>(() => {
    return (
      (searchParams.get("filter") as ModuleFilter) || defaultCategoryFilter
    );
  });
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
  const [maxCostFilter, setMaxCostFilter] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true); // Initialize as true

  // Calculate max cost from programs
  const maxCost = useMemo(() => {
    if (programs.length === 0) return 0;
    return Math.max(
      ...programs.map((program) =>
        typeof program.data.cost === "number" ? program.data.cost : 0
      )
    );
  }, [programs]);

  useEffect(() => {
    if (programs.length > 0 && !isInitialized && maxCost > 0) {
      setMaxCostFilter(maxCost);
      setIsInitialized(true);
    }
  }, [programs, maxCost, isInitialized]);

  const resetCostFilter = useCallback(() => {
    setMaxCostFilter(maxCost);
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
      // Clear opposite category filters when switching to specific filter types
      if (filter === "program_page" && _activeFilter !== "program_page") {
        // Clear resource-specific filters
        setSelectedResourceCategories([]);
        // Keep tags, formats, credentials, and cost filters for programs
      } else if (
        filter === "resource_page" &&
        _activeFilter !== "resource_page"
      ) {
        setSelectedProgramCategories([]);
        setSelectedFormats([]);
        setHasCredentials(false);
        setMaxCostFilter(maxCost);
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
    setMaxCostFilter(maxCost);
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

  // Filtering logic - For future put it into a hook
  const filteredItems = useMemo(() => {
    let items: (ResourcePageDocument | ProgramPageDocument)[] = [];

    const hasProgramSpecificFilters =
      selectedProgramCategories.length > 0 ||
      selectedFormats.length > 0 ||
      hasCredentials ||
      maxCostFilter !== maxCost;

    const hasResourceSpecificFilters = selectedResourceCategories.length > 0;
    const hasTagFilters = selectedTags.length > 0;

    // Determine initial item set based on active filter and specific filters
    if (activeFilter === "program_page") {
      items = programs;
    } else if (activeFilter === "resource_page") {
      items = resources;
    } else if (
      hasProgramSpecificFilters ||
      hasResourceSpecificFilters ||
      hasTagFilters
    ) {
      // When ANY filters are active (including tags), show both programs and resources
      // This allows tags to act as an OR clause at the top level
      items = [...programs, ...resources];
    } else {
      // Default "all" case with no specific filters
      items = [...programs, ...resources];
    }

    if (searchTerm) {
      items = fuzzySearch(searchTerm).filter((item) =>
        items.some((i) => i.id === item.id)
      );
    }

    items = items.filter((item) => {
      // Skip items that don't match the active filter ONLY if no cross-type filters are active
      // If tags are selected, allow both types to show through regardless of active filter
      if (
        activeFilter === "program_page" &&
        item.type !== "program_page" &&
        !hasTagFilters
      ) {
        return false;
      }
      if (
        activeFilter === "resource_page" &&
        item.type !== "resource_page" &&
        !hasTagFilters
      ) {
        return false;
      }

      const matchesResourceFilters =
        item.type === "resource_page" &&
        selectedResourceCategories.length > 0 &&
        item.data.category &&
        selectedResourceCategories.includes(
          "id" in item.data.category ? item.data.category.id : ""
        );

      const matchesProgramCategoryFilters =
        item.type === "program_page" &&
        selectedProgramCategories.length > 0 &&
        item.data.category &&
        selectedProgramCategories.includes(
          "id" in item.data.category ? item.data.category.id : ""
        );

      const matchesTagFilters =
        hasTagFilters &&
        item.tags &&
        selectedTags.some((tag) => item.tags?.includes(tag));

      const hasAnyFilters =
        selectedResourceCategories.length > 0 ||
        selectedProgramCategories.length > 0 ||
        hasTagFilters ||
        selectedFormats.length > 0 ||
        hasCredentials ||
        maxCostFilter !== maxCost;

      if (hasAnyFilters) {
        const passesTopLevelOR =
          matchesResourceFilters ||
          matchesProgramCategoryFilters ||
          matchesTagFilters;

        if (!passesTopLevelOR) {
          return false;
        }
      }

      if (item.type === "program_page") {
        if (selectedFormats.length > 0) {
          if (!item.data.format) return false;

          const format = item.data.format;
          const hasVirtual = selectedFormats.includes(PROGRAM_FORMATS.VIRTUAL);
          const hasInPerson = selectedFormats.includes(
            PROGRAM_FORMATS.IN_PERSON
          );

          if (hasVirtual && !hasInPerson) {
            if (
              !(format === PROGRAM_FORMATS.VIRTUAL || format.includes("Both"))
            ) {
              return false;
            }
          }

          if (hasInPerson && !hasVirtual) {
            if (
              !(format === PROGRAM_FORMATS.IN_PERSON || format.includes("Both"))
            ) {
              return false;
            }
          }

          if (hasVirtual && hasInPerson) {
            if (!format.includes("Both")) {
              return false;
            }
          }
        }

        if (hasCredentials) {
          if (item.data.certs !== true) {
            return false;
          }
        }

        const itemCost =
          typeof item.data.cost === "number" ? item.data.cost : maxCost;
        if (itemCost > maxCostFilter) {
          return false;
        }
      }

      return true;
    });

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
    maxCostFilter,
    maxCost,
  ]);

  const filterCounts = useMemo(() => {
    const countFiltered = (type: ModuleFilter) => {
      let count = 0;

      if (type === "all") {
        count = filteredItems.length;
      } else if (type === "program_page") {
        count = filteredItems.filter(
          (item) => item.type === "program_page"
        ).length;
      } else if (type === "resource_page") {
        count = filteredItems.filter(
          (item) => item.type === "resource_page"
        ).length;
      }

      return count;
    };

    return {
      all: countFiltered("all"),
      program_page: countFiltered("program_page"),
      resource_page: countFiltered("resource_page"),
    };
  }, [filteredItems]);

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
    maxCostFilter,
    setMaxCostFilter,
    maxCost,
    resetCostFilter,
    isLoading,
    setLoading,
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
