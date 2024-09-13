import { AbsolutePathNode } from "../../StateGetters/Identifiers/sectionPaths/sectionPathNames";
import { SectionName } from "../schema2SectionNames";
import { ChildName, getChildNames } from "./ChildName";
import { childToSectionName } from "./ChildSectionName";

export type DescendantOfSnByNodeInfo<SN extends SectionName = SectionName> = {
  sectionName: SN;
  descendantNodes: AbsolutePathNode[];
};

export type DescendantOfSnInfo<SN extends SectionName = SectionName> = {
  sectionName: SN;
  descendantNames: ChildName[];
};
export interface DescOfSnDbIdInfo<SN extends SectionName = SectionName>
  extends DescendantOfSnInfo<SN> {
  dbId: string;
}

export function selfAndDescSectionNames(
  sectionName: SectionName
): SectionName[] {
  const names = getDescendantNames(sectionName);
  const selfAndNames = new Set([...names, sectionName]);
  return [...selfAndNames];
}

function getDescendantNames(headName: SectionName): SectionName[] {
  const descendantNames: any[] = [];
  let headNames: SectionName[] = [headName];

  let reps = 0;
  while (headNames.length > 0) {
    const nextHeadNames: SectionName[] = [];
    for (const headName of headNames) {
      const childNames = getChildNames(headName);
      for (const childName of childNames) {
        const sectionName = childToSectionName(headName, childName);
        nextHeadNames.push(sectionName);
        if (!descendantNames.includes(sectionName)) {
          descendantNames.push(sectionName);
        }
      }
    }
    headNames = nextHeadNames;
    reps++;
    if (reps > 100) {
      throw new Error(`While loop exceeded repetition limit.`);
    }
  }
  return descendantNames;
}
