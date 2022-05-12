import {
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { FeParentInfo } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { DbVarbs } from "../SectionPackRaw/RawSection";
import { OneRawSectionFinder } from "../SectionPackRaw/RawSectionFinder";
export type OneFeSectionNode<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  childFeIds: OneChildIdArrs<SN, "fe">;
  feId: string;
  dbId: string;
  dbVarbs: DbVarbs;
};
type FeSelfOrDescendantNodes<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneFeSectionNode<S>;
};
export type FeSelfOrDescendantNode<SN extends SectionName> =
  FeSelfOrDescendantNodes<SN>[SN];

export type OneSectionNodeMaker<SN extends SectionName> =
  OneRawSectionFinder<SN> & {
    feId: string;
    parentInfo: FeParentInfo<SN>;
  };
type SectionNodeMakers<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneSectionNodeMaker<S>;
};
export type SectionNodeMaker<SN extends SectionName> =
  SectionNodeMakers<SN>[SelfOrDescendantName<SN, "fe">];
