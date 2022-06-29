import { SimpleSectionName } from "../baseSections";

export type DbSectionInfo<SN extends SimpleSectionName = SimpleSectionName> = {
  sectionName: SN;
  dbId: string;
};
