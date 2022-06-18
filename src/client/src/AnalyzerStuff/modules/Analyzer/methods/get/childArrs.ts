import { SectionFinder } from "../../../../../App/sharedWithServer/SectionsMeta/baseSectionTypes";
import {
  ChildIdArrsWide,
  ChildName,
  DescendantIds,
  SelfAndDescendantIds,
} from "../../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../../../App/sharedWithServer/SectionsMeta/SectionName";
import { Obj } from "../../../../../App/sharedWithServer/utils/Obj";
import Analyzer from "../../../Analyzer";
import StateSection from "../../StateSection";

export function allChildDbIds<S extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<S>
): ChildIdArrsWide<S> {
  const childFeIds = this.section(finder).allChildFeIds();
  return Obj.entries(childFeIds).reduce((childDbIds, [sectionName, idArr]) => {
    const dbIds = [];
    dbIds.push(
      ...idArr.map(
        (id) => this.section({ sectionName, id, idType: "feId" }).dbId
      )
    );
    childDbIds[sectionName as ChildName<S>] = dbIds;
    return childDbIds;
  }, {} as ChildIdArrsWide<S>);
}

export function childSections<
  S extends SectionName<"hasChild">,
  CHN extends ChildName<S>
>(
  this: Analyzer,
  finder: SectionFinder<S>,
  childName: CHN
): StateSection<CHN>[] {
  const section = this.section(finder);
  const childFeIds = section.childFeIds(childName);
  return childFeIds.map((id) =>
    this.section({ id, sectionName: childName, idType: "feId" })
  );
}

export function descendantFeIdsPast<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): DescendantIds<SN, "fe"> {
  const descendantIds: { [key: string]: string[] } = {};

  const queue = this.section(finder).allChildFeInfos();
  while (queue.length > 0) {
    const queueLength = queue.length;
    for (let i = 0; i < queueLength; i++) {
      const feInfo = queue.shift();
      if (!feInfo) throw new Error("There should always be an feInfo here.");

      const { sectionName, id } = feInfo;
      if (!(sectionName in descendantIds)) descendantIds[sectionName] = [];

      const ids = descendantIds[sectionName];
      if (!ids.includes(id)) ids.push(id);

      queue.push(...this.section(feInfo).allChildFeInfos());
    }
  }
  return descendantIds as any;
}

export function descendantFeIds<SN extends SectionName>(
  this: Analyzer,
  headSectionFinder: SectionFinder<SN>
): DescendantIds<SN, "fe"> {
  const descendantIds: { [key: string]: string[] } = {};

  const queue: SectionFinder[] = [headSectionFinder];
  while (queue.length > 0) {
    const queueLength = queue.length;
    for (let i = 0; i < queueLength; i++) {
      const sectionFinder = queue.shift();
      if (!sectionFinder)
        throw new Error("There should always be an feInfo here.");

      const section = this.section(sectionFinder);
      for (const childName of section.meta.childNames) {
        if (!(childName in descendantIds)) descendantIds[childName] = [];

        section.childFeIds(childName).forEach((feId) => {
          if (!descendantIds[childName].includes(feId)) {
            descendantIds[childName].push(feId);
          }
        });
        queue.push(...section.childFeInfos(childName));
      }
    }
  }
  return descendantIds as any;
}

export function selfAndDescendantFeIds<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): SelfAndDescendantIds<SN> {
  const { feId, sectionName } = this.section(finder);
  const descendantIds = this.descendantFeIds(finder);
  return {
    [sectionName]: [feId] as string[],
    ...descendantIds,
  } as SelfAndDescendantIds<SN>;
}
