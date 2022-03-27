import array from "../../../utils/Arr";
import { cloneDeep } from "lodash";
import {
  ChildFeInfo,
  ChildIdArrs,
  ChildName,
} from "../../SectionMetas/relNameArrs";
import { sectionMetas } from "../../SectionMetas";
import StateSection from "../../StateSection";
import { SectionName } from "../../SectionMetas/SectionName";

export function childFeIds<S extends SectionName>(
  this: StateSection<S>,
  childName: ChildName<S>
): string[] {
  const { childFeIdArrs } = this.core;
  if (childName in childFeIdArrs) {
    return childFeIdArrs[childName];
  } else
    throw new Error(
      `${childName} is not in section of sectionName ${this.sectionName}`
    );
}
export function allChildFeIds<S extends SectionName>(
  this: StateSection<S>
): ChildIdArrs<S> {
  return cloneDeep(this.core.childFeIdArrs);
}
export function childIdx<S extends SectionName>(
  this: StateSection<S>,
  { sectionName, id }: ChildFeInfo<S>
): number {
  const idx = this.childFeIds(sectionName).indexOf(id);
  if (idx === -1)
    throw new Error(`Section at ${sectionName}.${id} not in its parent.`);
  return idx;
}
export function addChildFeId<S extends SectionName>(
  this: StateSection<S>,
  { sectionName, id }: ChildFeInfo<S>,
  idx?: number
) {
  let nextIds = [...this.childFeIds(sectionName)];
  if (idx) nextIds.splice(idx, 0, id);
  else nextIds.push(id);

  return this.update({
    childFeIdArrs: {
      ...this.core.childFeIdArrs,
      [sectionName]: nextIds,
    },
  });
}
export function removeChildFeId<S extends SectionName>(
  this: StateSection<S>,
  { sectionName, id }: ChildFeInfo<S>
) {
  const nextIds = array.findAndRmClone(
    this.childFeIds(sectionName),
    (childId) => childId === id
  );
  return this.update({
    childFeIdArrs: {
      ...this.core.childFeIdArrs,
      [sectionName]: nextIds,
    },
  });
}

export function initChildFeIds<S extends SectionName>(sectionName: S) {
  const childIds: Partial<ChildIdArrs<S>> = {};
  const meta = sectionMetas.get(sectionName);
  const childNames = meta.childSectionNames;
  for (const childName of childNames) {
    childIds[childName as keyof ChildIdArrs<S>] = [];
  }
  return childIds as ChildIdArrs<S>;
}
