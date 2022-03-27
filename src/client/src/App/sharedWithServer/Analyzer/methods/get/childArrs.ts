import Analyzer from "../../../Analyzer";
import { Obj } from "../../../utils/Obj";
import { FeInfo } from "../../SectionMetas/Info";
import {
  ChildIdArrs,
  ChildName,
} from "../../SectionMetas/relNameArrs/ChildTypes";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import StateSection from "../../StateSection";

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

export function children<S extends SectionName<"hasChild">>(
  this: Analyzer,
  focalInfo: FeNameInfo<S> | SectionName<"alwaysOne">,
  childName: ChildName<S>
): StateSection<ChildName<S>>[] {
  const section = this.section(focalInfo);
  const childFeIds = section.childFeIds(childName);
  return childFeIds.map((id) =>
    this.section({ id, sectionName: childName, idType: "feId" })
  );
}
