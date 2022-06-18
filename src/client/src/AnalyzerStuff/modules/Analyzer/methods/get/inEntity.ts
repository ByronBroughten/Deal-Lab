import { entityS } from "../../../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { SectionFinder } from "../../../../../App/sharedWithServer/SectionsMeta/baseSectionTypes";
import Analyzer from "../../../Analyzer";

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
