import Analyzer from "../../../Analyzer";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { Ent } from "../../SectionMetas/relSections/baseSections/baseValues/NumObj/entities";

export function newInEntity(
  this: Analyzer,
  finder: SectionFinder,
  varbName: string,
  offset: number
) {
  const entityName = this.displayNameVn(varbName, finder);
  return [
    entityName,
    Ent.inEntity(
      {
        id: "static",
        idType: "relative",
        sectionName: "propertyGeneral",
        varbName: varbName,
      },
      {
        offset,
        length: entityName.length,
      }
    ),
  ] as const;
}
