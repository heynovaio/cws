"use client";
import React, { createContext, useContext } from "react";
import {
  ResourcePageDocument,
  ProgramPageDocument,
} from "../../prismicio-types";

interface CategoryFilterContextProps {
  resources: ResourcePageDocument[];
  setResources: (resources: ResourcePageDocument[]) => void;
  programs: ProgramPageDocument[];
  setPrograms: (programs: ProgramPageDocument[]) => void;
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
}

const CategoryFilterContext = createContext<
  CategoryFilterContextProps | undefined
>(undefined);

export const defaultCategoryFilter = "All" as string;

const CategoryFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resources, setResources] = React.useState<ResourcePageDocument[]>([]);
  const [programs, setPrograms] = React.useState<ProgramPageDocument[]>([]);
  const [activeFilter, setActiveFilter] = React.useState<string>(
    defaultCategoryFilter
  );

  return (
    <CategoryFilterContext.Provider
      value={{
        resources,
        setResources,
        programs,
        setPrograms,
        activeFilter,
        setActiveFilter,
      }}
    >
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
