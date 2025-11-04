import { Content } from "@prismicio/client";

export function linkResolver(doc: Content.AllDocumentTypes): string {
  switch (doc.type) {
    case "page":
      return doc.uid === "home" ? "/" : `/${doc.uid}`;
    case "program_page":
      return `/program/${doc.uid}`;
    case "resource_page":
      return `/resource/${doc.uid}`;
    case "contact_page":
      return `/contact`;
    case "team_members":
      return `/team`;
    case "campaign_page":
      return `/campaign/${doc.uid}`;
    case "search_page":
      return `/search`;
    case "career_hub":
      return `/careers`;
    case "career_page":
      return `/careers/${doc.uid}`;
    default:
      return "/";
  }
}
