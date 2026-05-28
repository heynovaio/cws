import {
  isFilled,
  RichTextField,
  LinkField,
  ImageField,
  KeyTextField,
  SelectField,
  TableField,
} from "@prismicio/client";

type CheckableField =
  | RichTextField
  | LinkField
  | ImageField
  | KeyTextField
  | SelectField
  | TableField
  | CheckableField[]
  | string
  | null
  | undefined;

function isFieldFilled(field: CheckableField): boolean {
  if (field === null || field === undefined) return false;
  if (typeof field === "string") return field.trim().length > 0;
  if (Array.isArray(field)) {
    if (field.length === 0) return false;
    if (typeof field[0] === "object" && field[0] !== null && "type" in field[0]) {
      return isFilled.richText(field as RichTextField);
    }
    return field.some((item) => isFieldFilled(item as CheckableField));
  }
  if (typeof field === "object") {
    if ("url" in field && "dimensions" in field) return isFilled.image(field as ImageField);
    if ("link_type" in field) return isFilled.link(field as LinkField);
    if ("head" in field || "body" in field) return isFilled.table(field as TableField);
  }
  return false;
}

export function hasContent(...fields: CheckableField[]): boolean {
  return fields.some(isFieldFilled);
}

export function allContent(...fields: CheckableField[]): boolean {
  return fields.every(isFieldFilled);
}