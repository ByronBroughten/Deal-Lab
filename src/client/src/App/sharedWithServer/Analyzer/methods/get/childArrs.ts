import Analyzer from "../../../Analyzer";
import { Obj } from "../../../utils/Obj";
import { FeInfo } from "../../SectionMetas/Info";
import { ChildIdArrs, ChildName } from "../../SectionMetas/relSectionTypes";
import { SectionName } from "../../SectionMetas/SectionName";

export function childDbIdArrs<S extends SectionName>(
  this: Analyzer,
  feInfo: FeInfo
): ChildIdArrs<S> {
  const childFeIds = this.section(feInfo).allChildFeIds();
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

// export function initChildFeIds<S extends SectionName>(
//   this: Analyzer,
//   sectionName: SectionName
// ) {
//   const sectionNames = this.meta.get(sectionName)
//     .childSectionNames as ChildName<S>[];
//   return sectionNames.reduce((childFeIds, sectionName) => {
//     childFeIds[sectionName] = [];
//     return childFeIds;
//   }, {} as ChildIdArrs<S>);
// }
