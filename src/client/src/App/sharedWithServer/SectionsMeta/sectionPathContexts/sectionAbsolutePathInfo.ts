import { ChildName } from "../sectionChildrenDerived/ChildName";
import { SectionName } from "../SectionName";

export type SectionAbsolutePathInfo<
  SN extends SectionName,
  PT extends ChildName[] = ChildName[]
> = {
  sectionName: SN;
  path: PT;
};
export function sectionAbsolutePathInfo<
  SN extends SectionName,
  PT extends ChildName[]
>(sectionName: SN, path: PT): SectionAbsolutePathInfo<SN, PT> {
  return {
    sectionName,
    path,
  };
}
