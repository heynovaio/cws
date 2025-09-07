export const PROGRAM_FORMATS = {
  VIRTUAL: "Virtual",
  IN_PERSON: "In-Person",
} as const;

export const PROGRAM_FORMAT_TRANSLATIONS = {
  "en-ca": {
    Virtual: "Virtual",
    "In-Person": "In-Person",
    Both: "Virtual & In-Person",
  },
  "fr-ca": {
    Virtual: "Virtuel",
    "In-Person": "En Personne",
    Both: "Virtuel & En Personne",
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
