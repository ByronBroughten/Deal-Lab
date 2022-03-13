import Analyzer from "../../../Analyzer";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  InEntities,
  InEntity,
} from "../../SectionMetas/relSections/rel/valueMeta/NumObj/entities";
import { internal } from "../internal";

function entityInEntities(entities: InEntities, entity: InEntity): boolean {
  const match = entities.find((e) => (e.entityId = entity.entityId));
  if (match) return true;
  else return false;
}

export function updateConnectedEntities(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextEntities: InEntities
): Analyzer {
  let next = analyzer;

  const entities = next.varb(feVarbInfo).inEntities;
  const missingEntities = entities.filter(
    (entity) => !entityInEntities(nextEntities, entity)
  );
  const newEntities = nextEntities.filter(
    (entity) => !entityInEntities(entities, entity)
  );
  for (const entity of missingEntities) {
    if (next.hasSection(entity)) {
      next = internal.removeInEntity(next, feVarbInfo, entity);
    }
  }

  for (const entity of newEntities) {
    next = internal.addInEntity(next, feVarbInfo, entity);
  }
  return next;
}
