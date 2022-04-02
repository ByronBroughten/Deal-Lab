import { MergeUnionObjNonNullable } from "../../utils/types/mergeUnionObj";
// import {
//   GeneralChildIdArrs,
//   SelfOrDescendantName,
// } from "../SectionMetas/relNameArrs/ChildTypes";
// import { ContextName } from "../SectionMetas/relSections/baseSections";
// import { SectionName } from "../SectionMetas/SectionName";
// import { DbVarbs } from "../SectionPack";

// type GeneralRawSection = {
//   dbId: string;
//   dbVarbs: DbVarbs;
//   childDbIds: GeneralChildIdArrs;
// };
// export type OneRawSection<
//   SN extends SectionName,
//   CN extends ContextName
// > = GeneralRawSection & {
//   dbId: string;
//   dbVarbs: DbVarbs;
//   childDbIds: OneChildIdArrs<SN, CN>;
// };
// export type RawSections<SN extends SectionName, CN extends ContextName> = {
//   [DSN in SelfOrDescendantName<SN, CN>]: OneRawSection<DSN, CN>[];
// };

// export type RawSection<
//   SN extends SectionName,
//   CN extends ContextName
// > = RawSections<SN, CN>[SelfOrDescendantName<SN, CN>][number];
// export type RawSectionWide<
//   SN extends SectionName,
//   CN extends ContextName
// > = MergeUnionObjNonNullable<RawSection<SN, CN>>;
