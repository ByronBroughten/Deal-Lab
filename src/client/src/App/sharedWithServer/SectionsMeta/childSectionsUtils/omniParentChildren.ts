import { Arr } from "../../utils/Arr";
import { StrictExclude } from "../../utils/types";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { childSection, ChildSection } from "./childSection";

type OmniParentChildren = {
  [SN in StrictExclude<
    SimpleSectionName,
    "root" | "omniParent"
  >]: ChildSection<SN>;
};
export const relOmniParentChildren = Arr.excludeStrict(simpleSectionNames, [
  "root",
  "omniParent",
]).reduce((omniNames, sectionName) => {
  (omniNames as any)[sectionName] = childSection(sectionName);
  return omniNames;
}, {} as OmniParentChildren);
