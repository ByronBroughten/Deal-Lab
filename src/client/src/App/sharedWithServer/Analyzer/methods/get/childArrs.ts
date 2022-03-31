import Analyzer from "../../../Analyzer";
import { Obj } from "../../../utils/Obj";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import {
  ChildIdArrs,
  ChildName,
  DescendantIds,
} from "../../SectionMetas/relNameArrs/ChildTypes";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  SectionContextProps,
  SectionName,
} from "../../SectionMetas/SectionName";
import StateSection from "../../StateSection";

export function allChildDbIds<S extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<S>
): ChildIdArrs<S> {
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
  }, {} as ChildIdArrs<S>);
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

// everything is based on descendantSections
export function descendantFeIds<SN extends SectionName>(
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
