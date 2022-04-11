import {
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { ParentFinder } from "../SectionMetas/relNameArrs/ParentTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { DbVarbs } from "../SectionPackRaw/RawSection";
import { OneRawSectionFinder } from "../SectionPackRaw/RawSectionFinder";
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
export type OneSectionNodeMaker<SN extends SectionName> =
  OneRawSectionFinder<SN> & {
    feId: string;
    parentFinder: ParentFinder<SN, "fe">;
  };
type SectionNodeMakers<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneSectionNodeMaker<S>;
};
export type SectionNodeMaker<SN extends SectionName> =
  SectionNodeMakers<SN>[SelfOrDescendantName<SN, "fe">];

// import {
//   OneChildIdArrs,
//   SelfOrDescendantName,
// } from "../SectionMetas/relNameArrs/ChildTypes";
// import { ParentFinder } from "../SectionMetas/relNameArrs/ParentTypes";
// import { DbVarbs } from "../SectionPack";
// import { OneRawSectionFinder } from "../SectionPacks/RawSectionFinder";

// export type OneFeSectionNode<SN extends SectionName> = {
//   sectionName: SN;
//   parentFinder: ParentFinder<SN, "fe">;
//   childFeIds: OneChildIdArrs<SN, "fe">;
//   feId: string;
//   dbId: string;
//   dbVarbs: DbVarbs;
// };
// type FeSectionNodes<SN extends SectionName> = {
//   [S in SelfOrDescendantName<SN, "fe">]: OneFeSectionNode<S>;
// };
// export type FeSectionNode<SN extends SectionName> = FeSectionNodes<SN>[SN];

// //
// type OneSectionNodeMaker<SN extends SectionName> = OneRawSectionFinder<SN> & {
//   feId: string;
//   parentFinder: ParentFinder<SN, "fe">;
// };
// type SectionNodeMakers<SN extends SectionName> = {
//   [S in SelfOrDescendantName<SN, "fe">]: OneSectionNodeMaker<S>;
// };
// export type SectionNodeMaker<SN extends SectionName> =
//   SectionNodeMakers<SN>[SelfOrDescendantName<SN, "fe">];

// // type ChildNodeMakers<SN extends SectionName> = Pick<
// //   SectionNodeMakers<SN>,
// //   ChildName<SN, "fe"> & DescendantName<SN, "fe">
// // >;
// // type ChildNodeMaker<SN extends SectionName> = ChildNodeMakers<SN>[ChildName<
// //   SN,
// //   "fe"
// // > &
// //   DescendantName<SN, "fe">];
