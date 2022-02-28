import Analyzer from "../../../Analyzer";
import { ObjectEntries } from "../../../utils/Obj";
import { ChildIdArrs, ChildName } from "../../SectionMetas/relSectionTypes";
import { FeInfo } from "../../SectionMetas/Info";
import { SectionName } from "../../SectionMetas/SectionName";

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
