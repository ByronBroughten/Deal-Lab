import Analyzer from "../../../Analyzer";
import { Obj } from "../../../utils/Obj";
import { FeInfo } from "../../SectionMetas/Info";
import {
  FeNameInfo,
  SpecificSectionInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildIdArrs, ChildName } from "../../SectionMetas/relSectionTypes";
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

export function allChildFeIds<F extends SectionName<"alwaysOne">>(
  finder: F
): ChildIdArrs<F>;
export function allChildFeIds<F extends FeNameInfo>(
  finder: F
): ChildIdArrs<F["sectionName"]>;
export function allChildFeIds<F extends FeNameInfo | SectionName<"alwaysOne">>(
  this: Analyzer,
  finder: F
): any {
  const section = this.section(finder);
  return section.allChildFeIds();
}

export function childFeIds<
  I extends SpecificSectionInfo,
  S extends SectionName<"alwaysOne">
>(
  this: Analyzer,
  [finder, childName]: [I, ChildName<I["sectionName"]>] | [S, ChildName<S>]
) {
  const section = this.section(finder);
  return section.childFeIds(childName);
}
export function childFeInfos<
  I extends SpecificSectionInfo,
  S extends SectionName<"alwaysOne">
>(
  this: Analyzer,
  params: [I, ChildName<I["sectionName"]>] | [S, ChildName<S>]
): FeInfo[] {
  const [_, childName] = params;
  const childFeIds = this.childFeIds(params);

  return childFeIds.map((id) => ({
    sectionName: childName,
    id,
    idType: "feId",
  })) as FeInfo[];
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
