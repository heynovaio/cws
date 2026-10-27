"use client";

import { createContext, ReactNode, useContext } from "react";
import type { AppLocale } from "@/utils/localeHosts";

// The locale the server resolved for this request (domain on production,
// /fr-ca path elsewhere), so client components don't have to guess it.
const LocaleContext = createContext<AppLocale | null>(null);

export default function LocaleProvider({
  locale,
  children,
}: {
  locale: AppLocale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export const useServerLocale = () => useContext(LocaleContext);
