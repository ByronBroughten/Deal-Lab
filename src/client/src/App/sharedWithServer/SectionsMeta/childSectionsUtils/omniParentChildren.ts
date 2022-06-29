import { Arr } from "../../utils/Arr";
import { StrictExclude } from "../../utils/types";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { relChild, RelChild } from "./relChild";

type OmniParentChildren = {
  [SN in StrictExclude<SimpleSectionName, "root" | "omniParent">]: RelChild<SN>;
};
export const relOmniParentChildren = Arr.excludeStrict(simpleSectionNames, [
  "root",
  "omniParent",
]).reduce((omniNames, sectionName) => {
  (omniNames as any)[sectionName] = relChild(sectionName);
  return omniNames;
}, {} as OmniParentChildren);
