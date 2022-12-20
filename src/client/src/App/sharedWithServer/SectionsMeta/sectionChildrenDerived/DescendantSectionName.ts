import { SectionName } from "../SectionName";
import { ChildName, getChildNames } from "./ChildName";
import { ChildSectionNameNarrow, childToSectionName } from "./ChildSectionName";
import { ParentNameSafe } from "./ParentName";

export type DescendantOfSnInfo<
  SN extends SectionName,
  BSN extends SectionName
> = {
  sectionName: SN;
  descendantNames: DescendantName<BSN>[];
};
export interface DescOfSnDbIdInfo<
  SN extends SectionName,
  BSN extends SectionName
> extends DescendantOfSnInfo<SN, BSN> {
  dbId: string;
}

export type DescendantName<SN extends SectionName> = ChildName<SN> extends never
  ? never
  : ChildName<SN> | DescendantName<ChildSectionNameNarrow<SN>>;

export type AnscestorName<SN extends SectionName> =
  ParentNameSafe<SN> extends never
    ? never
    : ParentNameSafe<SN> | AnscestorName<ParentNameSafe<SN>>;

export type AnscestorChildName<SN extends SectionName> = ChildName<
  AnscestorName<SN>
>;

export type DescendantAncestorName<
  SN extends SectionName,
  S extends SectionName
> = Extract<DescendantName<SN>, AnscestorName<S>>;

export type DescendantSectionName<SN extends SectionName> =
  ChildSectionNameNarrow<SN> extends never
    ? never
    :
        | ChildSectionNameNarrow<SN>
        | DescendantSectionName<ChildSectionNameNarrow<SN>>;

export function getDescendantNames<SN extends SectionName>(
  headName: SN
): DescendantSectionName<SN>[] {
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
export function getSelfAndDescendantNames<SN extends SectionName>(
  sectionName: SN
): SelfOrDescendantSectionName<SN>[] {
  const names = getDescendantNames(sectionName);
  const selfAndNames = new Set([...names, sectionName]);
  return [...selfAndNames];
}

export type SelfOrDescendantSectionName<SN extends SectionName> =
  | SN
  | DescendantSectionName<SN>;

export type DescendantIds<SN extends SectionName> = {
  [S in DescendantSectionName<SN>]: string[];
};
export type SelfAndDescendantIds<SN extends SectionName> = {
  [S in SelfOrDescendantSectionName<SN>]: string[];
};

function _testDescendantType<
  SN extends SelfOrDescendantSectionName<"propertyGeneral">
>(sn: SN) {
  type FeTest = DescendantSectionName<"propertyGeneral">;
  const _test1: FeTest = "unit";
  // @ts-expect-error
  const _test3: FeTest = "loan";
}
