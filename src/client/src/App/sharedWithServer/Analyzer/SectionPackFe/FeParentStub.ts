import {
  OneChildIdArrs,
  SelfOrDescendantChildIdArr,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { FeNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionMetas/SectionName";

type OneFeNodeParentStub<SN extends SectionName> = {
  parentFinder: FeNameInfo<SN>;
  childFeIds: OneChildIdArrs<SN, "fe">;
  childDbIds: OneChildIdArrs<SN, "fe">;
};
type FeNodeParentStubs<SN extends SectionName> = {
  [S in SelfOrDescendantName<SN, "fe">]: OneFeNodeParentStub<S>;
};
export type FeNodeParentStub<SN extends SectionName> =
  FeNodeParentStubs<SN>[SelfOrDescendantName<SN, "fe">];

export type FeSelfOrDescendantParentStub<SN extends SectionName> = {
  parentFinder: FeNameInfo<SelfOrDescendantName<SN, "fe">>;
  childFeIds: SelfOrDescendantChildIdArr<SN, "fe">;
  childDbIds: SelfOrDescendantChildIdArr<SN, "fe">;
};
