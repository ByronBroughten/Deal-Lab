import { OneAddSectionProps } from "../methods/internal/addSections/addSectionsTypes";
import {
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { FeParentInfo } from "../SectionMetas/relNameArrs/ParentTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { DbVarbs } from "../SectionPack/RawSection";
import { OneRawSectionFinder } from "../SectionPack/RawSectionFinder";

export type OneFeSectionNode<SN extends SectionName> =
  OneAddSectionProps<SN> & {
    childFeIds: OneChildIdArrs<SN, "fe">;
    feId: string;
    dbVarbs: DbVarbs;
    dbId: string;
  };

type FeSectionNodes = {
  [S in SectionName]: OneFeSectionNode<S>;
};
export type FeSectionNode = FeSectionNodes[SectionName];

type FeSelfOrDescendantNodes<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneFeSectionNode<S>;
};
export type FeSelfOrDescendantNode<SN extends SectionName> =
  FeSelfOrDescendantNodes<SN>[SN];

export type OneSectionNodeMaker<SN extends SectionName> =
  OneRawSectionFinder<SN> & {
    feId: string;
    parentFinder: FeParentInfo<SN>;
    idx?: number;
  };
type SectionNodeMakers<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneSectionNodeMaker<S>;
};
export type SectionNodeMaker<SN extends SectionName> =
  SectionNodeMakers<SN>[SelfOrDescendantName<SN, "fe">];
