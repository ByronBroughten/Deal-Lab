import Analyzer from "../../Analyzer";
import { ObjectEntries } from "../../utils/Obj";
import { ChildIdArrs, ChildName } from "../SectionMetas/relSectionTypes";
import { FeInfo } from "../SectionMetas/Info";
import { SectionName } from "../SectionMetas/SectionName";

export function childDbIds<S extends SectionName>(
  this: Analyzer,
  feInfo: FeInfo
): ChildIdArrs<S> {
  const childFeIds = this.section(feInfo).allChildFeIds();
  return ObjectEntries(childFeIds).reduce(
    (childDbIds, [sectionName, idArr]) => {
      const dbIds = [];
      dbIds.push(
        ...idArr.map(
          (id) => this.section({ sectionName, id, idType: "feId" }).dbId
        )
      );
      childDbIds[sectionName as ChildName<S>] = dbIds;
      return childDbIds;
    },
    {} as ChildIdArrs<S>
  );
}
export function resetSectionAndChildDbIds(
  this: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const feInfos = this.nestedFeInfos(feInfo);
  const next = feInfos.reduce((next, info) => {
    return next.updateSection(info, {
      dbId: Analyzer.makeId(),
    });
  }, this);
  return next;
}
export function initChildFeIds<S extends SectionName>(
  this: Analyzer,
  sectionName: SectionName
) {
  const sectionNames = this.meta.get(sectionName)
    .childSectionNames as ChildName<S>[];
  return sectionNames.reduce((childFeIds, sectionName) => {
    childFeIds[sectionName] = [];
    return childFeIds;
  }, {} as ChildIdArrs<S>);
}
