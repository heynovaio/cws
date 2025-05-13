export const PROGRAM_FORMATS = {
  VIRTUAL: "Virtual",
  IN_PERSON: "In-Person",
} as const;

export type ProgramFormat =
  (typeof PROGRAM_FORMATS)[keyof typeof PROGRAM_FORMATS];
