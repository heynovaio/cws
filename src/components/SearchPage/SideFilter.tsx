import React, { useEffect } from "react";
import { ClearFilterButton } from "./ClearFilterButton";
import { ProgramsCategoriesFilterPanel } from "./ProgramsCategoriesFilterPanel";
import { ProgramsCostFilterPanel } from "./ProgramsCostFilterPanel";
import { ProgramsCredentialsFilterPanel } from "./ProgramsCredentialsFilterPanel";
import { ProgramsFormatFilterPanel } from "./ProgramsFormatFilterPanel";
import { ResourcesCategoriesFilterPanel } from "./ResourcesCategoriesFilterPanel";
import { SearchPanelContainer } from "./SearchPanelContainer";
import { TagsFilterPanel } from "./TagsFilterPanel";
import { useCategoryFilter } from "@/providers";

export const SideFilter = () => {
  const { activeFilter, availableTags } = useCategoryFilter();

  const [isResourceContainerHidden, setIsResourceContainerHidden] =
    React.useState(false);
  const [isProgramContainerHidden, setIsProgramContainerHidden] =
    React.useState(false);

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

  return (
    <div
      className={`flex flex-col ${availableTags.length > 0 && "gap-12"} pb-16 md:pb-4`}
    >
      <SearchPanelContainer panel={<TagsFilterPanel />} />
      <SearchPanelContainer
        label="Resource Filters"
        panel={<ResourcesCategoriesFilterPanel />}
        topPanel={availableTags.length > 0 ? true : false}
        isHidden={isResourceContainerHidden}
      />
      <SearchPanelContainer
        label="Program Filters"
        panel={
          <div className="flex flex-col gap-5">
            <ProgramsCategoriesFilterPanel />
            <ProgramsFormatFilterPanel />
            <ProgramsCostFilterPanel />
            <ProgramsCredentialsFilterPanel />
          </div>
        }
        topPanel={availableTags.length > 0 ? true : false}
        isHidden={isProgramContainerHidden}
      />
      <ClearFilterButton styling={availableTags.length > 0 ? "" : "mt-12"} />
    </div>
  );
};
