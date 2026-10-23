import React from "react";

interface SearchPanelContainerProps {
  label?: string;
  panel: React.ReactNode;
  topPanel?: boolean;
  isHidden?: boolean;
}

export const SearchPanelContainer = ({
  label,
  panel,
  topPanel = false,
  isHidden = false,
}: SearchPanelContainerProps) => {
  return (
    <>
      {!isHidden && (
        <div className="flex flex-col gap-5">
          {topPanel && (
            <hr className="h-[1px] border-t-0 mt-7 bg-[#6153a3]/30" />
          )}
          <label>{label}</label>
          {panel}
        </div>
      )}
    </>
  );
};
