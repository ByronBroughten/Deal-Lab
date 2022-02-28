import { pick } from "lodash";
import Analyzer from "../../../../Analyzer";
import { InEntities } from "../../../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";
import { NumberEntity } from "../../../SectionMetas/relSections/rel/relValues/numObjUpdateInfos/equationVarbUpdate";

export function entitiesToNumberEntities(
  analyzer: Analyzer,
  entities: InEntities
): NumberEntity[] {
  const numberEntities: NumberEntity[] = [];
  for (const entity of entities) {
    const varb = analyzer.findVarb(entity);
    numberEntities.push({
      ...pick(entity, ["offset", "length"]),
      number: varb ? varb.value("numObj").number : "?",
    });
  }
  return numberEntities;
}
