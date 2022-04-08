import {
  OneChildIdArrs,
  SelfOrDescendantIds,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { FeNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionMetas/SectionName";
type OneFeNodeParentStub<SN extends SectionName> = {
  parentFinder: FeNameInfo<SN>;
  childFeIds: OneChildIdArrs<SN, "fe">;
  childDbIds: OneChildIdArrs<SN, "fe">;
};
export type FeSelfOrDescendantParentStub<SN extends SectionName> = {
  parentFinder: FeNameInfo<SelfOrDescendantName<SN, "fe">>;
  childFeIds: SelfOrDescendantIds<SN, "fe">;
  childDbIds: SelfOrDescendantIds<SN, "fe">;
};
