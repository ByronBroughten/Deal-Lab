import { SectionName, SectionNameType } from "./SectionName";
export type DbSectionInfo<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
};
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionName<ST>;
  dbId: string;
};
