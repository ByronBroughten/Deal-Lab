import { SubType } from "../../../utils/typescript";
import { RelSections } from "../relSections";
import { BaseName } from "../relSections/baseSectionTypes";
import { HasRowIndexStoreName, relNameArrs } from "../relNameArrs";
import { HasOneParentSectionName, ParentName } from "./ParentTypes";

export type IndexStoreName<S extends HasIndexStoreName = HasIndexStoreName> =
  RelSections["fe"][S]["indexStoreName"];
export type IndexParentName<S extends HasIndexStoreName> = ParentName<
  IndexStoreName<S>
>;

type HasIndexStoreName = typeof relNameArrs.fe.hasIndexStore[number];
type HasDefaultStoreName = typeof relNameArrs.fe.hasDefaultStore[number];

export type DefaultStoreName<
  S extends HasDefaultStoreName = HasDefaultStoreName
> = RelSections["fe"][S]["indexStoreName"];
export type ExtraStoreName = IndexStoreName | DefaultStoreName;
export type ExtraStoreNameAlwaysOne = Extract<
  ExtraStoreName,
  BaseName<"alwaysOne">
>;
export type ExtraStoreNameOneParent = Extract<
  ExtraStoreName,
  HasOneParentSectionName<"fe">
>;

type TablePreSections = SubType<RelSections["fe"], { rowSourceName: string }>;
type SourceToTableName = {
  [Prop in keyof TablePreSections as TablePreSections[Prop]["rowSourceName"]]: Prop;
};

type SectionToRowIndexStoreName = {
  [Prop in HasRowIndexStoreName<"fe">]: IndexStoreName<Prop>;
};
type RowIndexStoreToSectionName = {
  [Prop in IndexStoreName<HasRowIndexStoreName<"fe">>]: keyof SubType<
    SectionToRowIndexStoreName,
    Prop
  >;
};

export const indexStoreToSectionName: RowIndexStoreToSectionName = {
  propertyIndex: "property",
  loanIndex: "loan",
  mgmtIndex: "mgmt",
  analysisIndex: "analysis",
};
export const rowIndexToTableName: SourceToTableName = {
  propertyIndex: "propertyTable",
  loanIndex: "loanTable",
  mgmtIndex: "mgmtTable",
  analysisIndex: "analysisTable",
};
