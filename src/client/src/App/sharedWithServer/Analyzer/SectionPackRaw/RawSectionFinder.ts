import { ContextName } from "../../SectionsMeta/baseSections";
import { SelfOrDescendantName } from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
export type OneRawSectionFinder<SN extends SectionName> = {
  sectionName: SN;
  dbId: string;
};
type RawSectionFinders<SN extends SectionName, CN extends ContextName> = {
  [S in SelfOrDescendantName<SN, CN>]: OneRawSectionFinder<S>;
};
export type RawSectionFinder<
  SN extends SectionName,
  CN extends ContextName = "fe"
> = RawSectionFinders<SN, CN>[SelfOrDescendantName<SN, CN>];
