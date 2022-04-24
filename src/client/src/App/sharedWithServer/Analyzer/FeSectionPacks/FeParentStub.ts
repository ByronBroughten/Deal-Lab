import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  SelfOrDescendantIds,
  SelfOrDescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";

export type FeSelfOrDescendantParentStub<SN extends SectionName> = {
  parentFinder: FeNameInfo<SelfOrDescendantName<SN, "fe">>;
  childFeIds: SelfOrDescendantIds<SN, "fe">;
  childDbIds: SelfOrDescendantIds<SN, "fe">;
};
