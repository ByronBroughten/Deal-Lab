import Analyzer from "../../../Analyzer";
import { entityS } from "../../../SectionMetas/baseSections/baseValues/entities";
import { SectionFinder } from "../../../SectionMetas/baseSectionTypes";

export function newInEntity(
  this: Analyzer,
  finder: SectionFinder,
  varbName: string,
  offset: number
) {
  const entityName = this.displayNameVn(varbName, finder);
  return [
    entityName,
    entityS.inEntity(
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
