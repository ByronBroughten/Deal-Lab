import { ContextName } from "../../SectionMetas/baseSections";
import { SelfOrDescendantName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
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
