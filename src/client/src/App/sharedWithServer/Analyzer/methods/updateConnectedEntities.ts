import Analyzer from "../../Analyzer";
import {
  InEntities,
  InEntity,
} from "../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";
import { FeVarbInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";

function entityInEntities(entities: InEntities, entity: InEntity): boolean {
  const match = entities.find((e) => (e.entityId = entity.entityId));
  if (match) return true;
  else return false;
}

export function updateConnectedEntities(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextEntities: InEntities
): Analyzer {
  let next = this;

  const entities = next.varb(feVarbInfo).inEntities;
  const missingEntities = entities.filter(
    (entity) => !entityInEntities(nextEntities, entity)
  );
  const newEntities = nextEntities.filter(
    (entity) => !entityInEntities(entities, entity)
  );
  for (const entity of missingEntities) {
    if (this.hasSection(entity)) {
      next = next.removeInEntity(feVarbInfo, entity);
    }
  }

  for (const entity of newEntities) {
    next = next.addInEntity(feVarbInfo, entity);
  }
  return next;
}
