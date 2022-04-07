import { SectionName } from "../SectionMetas/SectionName";

// type OneFeNodeParentStub<SN extends SectionName> = {
//   feInfo: FeNameInfo<SN>;
//   childFeIds: OneChildIdArrs<SN, "fe">;
//   childDbIds: OneChildIdArrs<SN, "fe">;
// };
// type FeNodeParentStubs<SN extends SectionName> = {
//   [S in SelfOrDescendantName<SN, "fe">]: OneFeNodeParentStub<S>;
// };
// export type FeNodeParentStub<SN extends SectionName> =
//   FeNodeParentStubs<SN>[SelfOrDescendantName<SN, "fe">];
