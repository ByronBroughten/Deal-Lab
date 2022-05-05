import { FeInfo, InfoS } from "../../../SectionMetas/Info";
import {
  ChildFeInfo,
  ChildName,
} from "../../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import array, { Arr } from "../../../utils/Arr";
import { Obj } from "../../../utils/Obj";
import StateSection from "../../FeSection";

export function childFeIds<S extends SectionName>(
  this: StateSection<S>,
  childName: ChildName<S>
): string[] {
  const { childFeIds } = this.core;
  if (childName in childFeIds) {
    return childFeIds[childName];
  } else
    throw new Error(
      `${childName} is not in section of sectionName ${this.sectionName}`
    );
}

export function allChildFeInfos<S extends SectionName>(
  this: StateSection<S>
): FeInfo[] {
  const childFeIds = this.allChildFeIds;
  return Obj.entries(childFeIds).reduce((feInfos, [childName, feIds]) => {
    const newFeInfos = feIds.map((id) => InfoS.fe(childName, id));
    return feInfos.concat(newFeInfos);
  }, [] as FeInfo[]);
}

export function childFeInfos<S extends SectionName>(
  this: StateSection<S>,
  childName: ChildName<S>
): FeInfo[] {
  const childFeIds = this.childFeIds(childName);
  return childFeIds.map((id) => ({
    sectionName: childName,
    id,
    idType: "feId",
  })) as FeInfo[];
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
function updateChildFeIdArr<SN extends SectionName>(
  next: StateSection<SN>,
  sectionName: SectionName,
  nextIds: string[]
): StateSection<SN> {
  return next.update({
    childFeIds: {
      ...next.core.childFeIds,
      [sectionName]: nextIds,
    },
  });
}

export function insertChildFeId<SN extends SectionName>(
  this: StateSection<SN>,
  { sectionName, id }: ChildFeInfo<SN>,
  idx: number
): StateSection<SN> {
  const nextIds = Arr.insert(this.childFeIds(sectionName), id, idx);
  return updateChildFeIdArr(this, sectionName, nextIds);
}
export function pushChildFeId<SN extends SectionName>(
  this: StateSection<SN>,
  { sectionName, id }: ChildFeInfo<SN>
): StateSection<SN> {
  let nextIds = [...this.childFeIds(sectionName), id];
  return updateChildFeIdArr(this, sectionName, nextIds);
}
export function addChildFeId<SN extends SectionName>(
  this: StateSection<SN>,
  childInfo: ChildFeInfo<SN>,
  idx?: number | undefined
): StateSection<SN> {
  if (idx === undefined) return this.pushChildFeId(childInfo);
  else return this.insertChildFeId(childInfo, idx);
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
    childFeIds: {
      ...this.core.childFeIds,
      [sectionName]: nextIds,
    },
  });
}
