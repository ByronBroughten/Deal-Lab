import { Arr } from "../../utils/Arr";
import { StrictExclude } from "../../utils/types";
import { SectionName, sectionNames } from "../schema2SectionNames";
import { ChildSection, sectionChild } from "./sectionChild";

type OmniParentChildren = {
  [SN in StrictExclude<SectionName, "root" | "omniParent">]: ChildSection<SN>;
};
export const relOmniParentChildren = Arr.excludeStrict(sectionNames, [
  "root",
  "omniParent",
]).reduce((omniNames, sectionName) => {
  (omniNames as any)[sectionName] = sectionChild(sectionName);
  return omniNames;
}, {} as OmniParentChildren);
