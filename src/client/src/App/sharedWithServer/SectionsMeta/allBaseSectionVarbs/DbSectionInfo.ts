import { SectionName } from "../SectionName";

export type DbSectionInfo<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
};
