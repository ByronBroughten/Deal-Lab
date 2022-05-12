import {
  entityS,
  InEntities,
  InEntity
} from "../../../SectionMetas/baseSections/baseValues/entities";
import { FeVarbInfo } from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { Arr } from "../../../utils/Arr";
import StateVarb from "../StateVarb";

// all varbs that may have inEntities are in mutable sections.
// so all outEntities (which point to the varbs with inEntities)
// are FeVarbInfos rather than static.
export type OutEntity = FeVarbInfo & { entityId: string };
export function findInEntity(
  this: StateVarb,
  entityId: string
): InEntity | undefined {
  return Arr.findIn(this.inEntities, (entity) => entity.entityId === entityId);
}
export function addInEntity(this: StateVarb, entity: InEntity): StateVarb {
  const value = this.value("numObj");
  return this.update({
    value: value.addEntity(entity),
  });
}
export function removeInEntity(this: StateVarb, entityId: string): StateVarb {
  const value = this.value("numObj");
  return this.update({
    value: value.removeEntity(entityId),
  });
}

export function addOutEntity(this: StateVarb, entity: OutEntity): StateVarb {
  if (!entityS.entitiesHas(this.outEntities, entity)) {
    return this.update({
      // the order is important.
      outEntities: [...this.outEntities, entity],
    });
  } else return this;
}
export function removeOutEntity(
  this: StateVarb,
  outEntity: OutEntity
): StateVarb {
  const nextOutEntities = Arr.rmLikeObjClone(this.outEntities, outEntity);
  return this.update({
    outEntities: nextOutEntities,
  });
}
export function setInEntities(this: StateVarb, entities: InEntities) {
  const value = this.value("numObj");
  return this.update({
    value: value.updateCore({ entities }),
  });
}
