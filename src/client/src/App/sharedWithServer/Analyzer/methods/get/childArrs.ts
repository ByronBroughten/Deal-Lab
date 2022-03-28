import Analyzer from "../../../Analyzer";
import { Obj } from "../../../utils/Obj";
import {
  ChildIdArrs,
  ChildName,
} from "../../SectionMetas/relNameArrs/ChildTypes";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import StateSection from "../../StateSection";

export function childDbIdArrs<S extends SectionName>(
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

export function allChildSections<S extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<S>
) {
  const section = this.section(finder);
  const allChildFeIds = section.allChildFeIds();
}
