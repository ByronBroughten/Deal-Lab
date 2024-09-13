import { SectionName } from "../schema2SectionNames";

export type DbSectionInfo<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
};
