import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { propertyDefaultChildMakers } from "./propertyDefaultChildMakers";

export const childDefaultMakers = {
  property: propertyDefaultChildMakers,
} as const;

export function hasDefaultChild<S extends SectionName, CN extends ChildName<S>>(
  sectionName: S,
  childName: CN
) {
  if (Obj.isKey(childDefaultMakers, sectionName)) {
    const childMakers = childDefaultMakers[sectionName];
    if (Obj.isKey(childMakers, childName)) {
      return true;
    }
  }
}

export function makeDefaultChildPack<
  S extends SectionName,
  CN extends ChildName<S>
>(sectionName: S, childName: CN): SectionPack<ChildSectionName<S, CN>> {
  if (Obj.isKey(childDefaultMakers, sectionName)) {
    const childMakers = childDefaultMakers[sectionName];
    if (Obj.isKey(childMakers, childName)) {
      const childMaker = childMakers[
        childName
      ] as any as () => SectionPack<any>;
      return childMaker();
    }
  }
  throw new Error(
    `There is no default child sectionPack for ${sectionName}.${childName}`
  );
}
