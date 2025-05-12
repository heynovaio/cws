import React from "react";

interface SearchPanelContainerProps {
  label?: string;
  panel: React.ReactNode;
  topPanel?: boolean;
}

export const SearchPanelContainer = ({
  label,
  panel,
  topPanel = false,
}: SearchPanelContainerProps) => {
  return (
    <div className="flex flex-col gap-5">
      {topPanel && (
        <hr className="h-[1px] border-t-0 bg-neutral-100 bg-white/70" />
      )}
      <label>{label}</label>
      {panel}
    </div>
  );
};
