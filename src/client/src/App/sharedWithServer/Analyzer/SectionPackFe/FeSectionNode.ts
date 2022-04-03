import {
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { ParentFinder } from "../SectionMetas/relNameArrs/ParentTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { DbVarbs } from "../SectionPack/RawSection";
import { OneRawSectionFinder } from "../SectionPack/RawSectionFinder";

export type OneFeSectionNode<SN extends SectionName> = {
  sectionName: SN;
  parentFinder: ParentFinder<SN, "fe">;
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

type OneSectionNodeMaker<SN extends SectionName> = OneRawSectionFinder<SN> & {
  feId: string;
  parentFinder: ParentFinder<SN, "fe">;
};
type SectionNodeMakers<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneSectionNodeMaker<S>;
};
export type SectionNodeMaker<SN extends SectionName> =
  SectionNodeMakers<SN>[SelfOrDescendantName<SN, "fe">];
