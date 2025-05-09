import React, { createContext, useContext, ReactNode } from "react";
import { GlobalsDocumentData } from "../../prismicio-types";

interface LabelProviderProps {
  labels: GlobalsDocumentData;
  children: ReactNode;
}

const LabelContext = createContext<GlobalsDocumentData | undefined>(undefined);

export const LabelProvider: React.FC<LabelProviderProps> = ({
  labels,
  children,
}) => {
  return (
    <LabelContext.Provider value={labels}>{children}</LabelContext.Provider>
  );
};

export const useLabels = (): GlobalsDocumentData => {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error("useLabels must be used within a LabelProvider");
  }
  return context;
};
