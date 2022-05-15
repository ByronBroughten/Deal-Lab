import { FeNameInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  SelfAndDescendantIds,
  SelfOrDescendantName,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";

export type FeSelfOrDescendantParentStub<SN extends SectionName> = {
  parentInfo: FeNameInfo<SelfOrDescendantName<SN, "fe">>;
  childFeIds: SelfAndDescendantIds<SN>;
  childDbIds: SelfAndDescendantIds<SN>;
};
