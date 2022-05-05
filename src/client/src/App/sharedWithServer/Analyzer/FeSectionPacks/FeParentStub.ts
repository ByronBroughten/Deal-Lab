import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  SelfAndDescendantIds,
  SelfOrDescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";

export type FeSelfOrDescendantParentStub<SN extends SectionName> = {
  parentFinder: FeNameInfo<SelfOrDescendantName<SN, "fe">>;
  childFeIds: SelfAndDescendantIds<SN>;
  childDbIds: SelfAndDescendantIds<SN>;
};
