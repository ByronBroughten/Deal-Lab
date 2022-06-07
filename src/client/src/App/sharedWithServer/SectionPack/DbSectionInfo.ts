import { ContextName } from "../SectionsMeta/baseSections";
import { SelfOrDescendantName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName, SectionNameType } from "../SectionsMeta/SectionName";
export type DbSectionInfo<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
};
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionName<ST>;
  dbId: string;
};

type RawSectionFinders<SN extends SectionName, CN extends ContextName> = {
  [S in SelfOrDescendantName<SN, CN>]: DbSectionInfo<S>;
};
export type RawSectionFinder<
  SN extends SectionName,
  CN extends ContextName = "fe"
> = RawSectionFinders<SN, CN>[SelfOrDescendantName<SN, CN>];
