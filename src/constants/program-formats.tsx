export const PROGRAM_FORMATS = {
  VIRTUAL: "virtual",
  IN_PERSON: "in_person",
} as const;

export const PROGRAM_FORMAT_TRANSLATIONS = {
  "en-ca": {
    virtual: "Virtual",
    in_person: "In-Person",
    both: "Both",
  },
  "fr-ca": {
    virtual: "Virtuel",
    in_person: "En Personne",
    both: "Les Deux",
  },
} as const;

export type ProgramFormat =
  (typeof PROGRAM_FORMATS)[keyof typeof PROGRAM_FORMATS];
export type SupportedLanguage = keyof typeof PROGRAM_FORMAT_TRANSLATIONS;

// Helper function
export const getFormatLabel = (
  format: ProgramFormat | "both",
  lang: SupportedLanguage
) => {
  return (
    PROGRAM_FORMAT_TRANSLATIONS[lang]?.[
      format as keyof (typeof PROGRAM_FORMAT_TRANSLATIONS)[typeof lang]
    ] ||
    PROGRAM_FORMAT_TRANSLATIONS["en-ca"][
      format as keyof (typeof PROGRAM_FORMAT_TRANSLATIONS)["en-ca"]
    ]
  );
};
