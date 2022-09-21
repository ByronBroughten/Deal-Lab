import { SimpleSectionName } from "../baseSectionsVarbs";

export type DbSectionInfo<SN extends SimpleSectionName = SimpleSectionName> = {
  sectionName: SN;
  dbId: string;
};
