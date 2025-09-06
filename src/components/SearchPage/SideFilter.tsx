import React, { useEffect, useState } from "react";
import { ClearFilterButton } from "./ClearFilterButton";
import { ProgramsCategoriesFilterPanel } from "./ProgramsCategoriesFilterPanel";
import { ProgramsCostFilterPanel } from "./ProgramsCostFilterPanel";
import { ProgramsCredentialsFilterPanel } from "./ProgramsCredentialsFilterPanel";
import { ProgramsFormatFilterPanel } from "./ProgramsFormatFilterPanel";
import { ResourcesCategoriesFilterPanel } from "./ResourcesCategoriesFilterPanel";
import { SearchPanelContainer } from "./SearchPanelContainer";
import { TagsFilterPanel } from "./TagsFilterPanel";
import { useCategoryFilter } from "@/providers";

export const SideFilter = ({ lang }: { lang: string }) => {
  const { activeFilter, availableTags, isLoading, selectedTags, toggleTag } =
    useCategoryFilter();

  const [isResourceContainerHidden, setIsResourceContainerHidden] =
    useState(false);
  const [isProgramContainerHidden, setIsProgramContainerHidden] =
    useState(false);
  const [loadingStage, setLoadingStage] = useState(0); // 0 = initial, 1 = tags loaded, 2 = resources loaded, 3 = all loaded

  useEffect(() => {
    if (activeFilter === "resource_page") {
      setIsResourceContainerHidden(false);
      setIsProgramContainerHidden(true);
    } else if (activeFilter === "program_page") {
      setIsResourceContainerHidden(true);
      setIsProgramContainerHidden(false);
    } else {
      setIsResourceContainerHidden(false);
      setIsProgramContainerHidden(false);
    }
  }, [activeFilter]);

  // Simulate staggered loading
  useEffect(() => {
    if (isLoading) {
      setLoadingStage(0);
      return;
    }

    // Start loading sequence when data is ready
    const timer1 = setTimeout(() => setLoadingStage(1), 100); // Tags load first
    const timer2 = setTimeout(() => setLoadingStage(4), 300); // Then resources
    const timer3 = setTimeout(() => setLoadingStage(6), 500); // Then programs

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isLoading]);

  return (
    <div
      className={`flex flex-col ${availableTags.length > 0 && "gap-12"} pb-16 md:pb-4`}
    >
      {/* Tags Panel - Always load first */}
      <SearchPanelContainer
        panel={
          loadingStage < 1 ? (
            <div className="h-32 bg-white/10 animate-pulse rounded"></div>
          ) : (
            <TagsFilterPanel
              availableTags={availableTags}
              selectedItems={selectedTags}
              toggleTag={toggleTag}
            />
          )
        }
      />

      {/* Resource Filters - Load second */}
      {loadingStage >= 1 && (
        <SearchPanelContainer
          label={
            lang === "fr-ca" ? "Filtres de ressources" : "Resource Filters"
          }
          panel={
            loadingStage < 2 ? (
              <div className="h-48 bg-white/10 animate-pulse rounded"></div>
            ) : (
              <ResourcesCategoriesFilterPanel />
            )
          }
          topPanel={availableTags.length > 0}
          isHidden={isResourceContainerHidden}
        />
      )}

      {/* Program Filters - Load last */}
      {loadingStage >= 2 && (
        <SearchPanelContainer
          label={lang === "fr-ca" ? "Filtres de programmes" : "Program Filters"}
          panel={
            loadingStage < 3 ? (
              <div className="h-64 bg-white/10 animate-pulse rounded"></div>
            ) : (
              <div className="flex flex-col gap-5">
                <ProgramsCategoriesFilterPanel lang={lang} />
                <ProgramsFormatFilterPanel lang={lang} />
                <ProgramsCostFilterPanel lang={lang} />
                <ProgramsCredentialsFilterPanel lang={lang} />
              </div>
            )
          }
          topPanel={availableTags.length > 0 || !isResourceContainerHidden}
          isHidden={isProgramContainerHidden}
        />
      )}

      {/* Clear Button - Only show after all panels loaded */}
      {loadingStage >= 3 && (
        <ClearFilterButton
          styling={availableTags.length > 0 ? "" : "mt-12"}
          lang={lang}
        />
      )}
    </div>
  );
};
