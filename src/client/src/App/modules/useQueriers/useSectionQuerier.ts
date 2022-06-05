import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";

export function useSectionQuerier(sectionName: SectionName<"indexStore">) {
  return new SectionQuerier(sectionName);
} // table manager row will just use  sectionQuerier, right?
