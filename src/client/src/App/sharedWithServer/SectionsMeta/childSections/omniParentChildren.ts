import { Arr } from "../../utils/Arr";
import { StrictExclude } from "../../utils/types";
import { SectionName, sectionNames } from "../SectionName";
import { childSection, ChildSection } from "./childSection";

type OmniParentChildren = {
  [SN in StrictExclude<SectionName, "root" | "omniParent">]: ChildSection<SN>;
};
export const relOmniParentChildren = Arr.excludeStrict(sectionNames, [
  "root",
  "omniParent",
]).reduce((omniNames, sectionName) => {
  (omniNames as any)[sectionName] = childSection(sectionName);
  return omniNames;
}, {} as OmniParentChildren);
