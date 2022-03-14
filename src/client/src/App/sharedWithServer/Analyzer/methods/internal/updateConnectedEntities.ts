import Analyzer from "../../../Analyzer";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  entitiesHasEntity,
  InEntity,
} from "../../SectionMetas/relSections/rel/valueMeta/NumObj/entities";
import { internal } from "../internal";

export function updateConnectedEntities(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextEntities: InEntity[]
): Analyzer {
  const currentEntities = analyzer.varb(feVarbInfo).inEntities;
  const missingEntities = currentEntities.filter(
    (entity) => !entitiesHasEntity(nextEntities, entity)
  );
  const newEntities = nextEntities.filter(
    (entity) => !entitiesHasEntity(currentEntities, entity)
  );

  let next = analyzer;
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
