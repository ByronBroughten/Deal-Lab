import {
  ChildIdArrsWide,
  SelfOrDescendantName,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentFeInfo } from "../../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { DbSectionInfo } from "../DbSectionInfo";
import { DbVarbs } from "../RawSection";
export type OneFeSectionNode<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: ParentFeInfo<SN>;
  childFeIds: ChildIdArrsWide<SN>;
  feId: string;
  dbId: string;
  dbVarbs: DbVarbs;
};
type FeSelfOrDescendantNodes<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneFeSectionNode<S>;
};
export type FeSelfOrDescendantNode<SN extends SectionName> =
  FeSelfOrDescendantNodes<SN>[SN];

export type OneSectionNodeMaker<SN extends SectionName> = DbSectionInfo<SN> & {
  feId: string;
  parentInfo: ParentFeInfo<SN>;
};
type SectionNodeMakers<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneSectionNodeMaker<S>;
};
export type SectionNodeMaker<SN extends SectionName> =
  SectionNodeMakers<SN>[SelfOrDescendantName<SN, "fe">];
