import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import Arr from "../../../utils/Arr";
import StateVarb from "../StateVarb";
import {
  InEntities,
  InEntity,
} from "../../SectionMetas/relSections/rel/valueMeta/NumObj/entities";

// all varbs that may have inEntities are in mutable sections.
// so all outEntities (which point to the varbs with inEntities)
// are FeVarbInfos rather than static.
export type OutEntity = FeVarbInfo;
export function findInEntity(
  this: StateVarb,
  entityId: string
): InEntity | undefined {
  return Arr.findIn(this.inEntities, (entity) => entity.entityId === entityId);
}
export function addInEntity(this: StateVarb, entity: InEntity): StateVarb {
  const value = this.value("numObj");
  return this.updateProps({
    value: value.addEntity(entity),
  });
}
export function removeInEntity(this: StateVarb, entityId: string): StateVarb {
  const value = this.value("numObj");
  return this.updateProps({
    value: value.removeEntity(entityId),
  });
}

function entityInEntities(entities: InEntities, entity: InEntity): boolean {
  const match = entities.find((e) => e.entityId === entity.entityId);
  if (match) return true;
  else return false;
}

export function addOutEntity(this: StateVarb, entity: OutEntity): StateVarb {
  // the order is important.

  if (!Arr.objIsIn(entity, this.outEntities)) {
    return this.updateProps({
      outEntities: [...this.outEntities, entity],
    });
  } else return this;
}
export function removeOutEntity(
  this: StateVarb,
  outEntity: OutEntity
): StateVarb {
  const nextOutEntities = Arr.rmLikeObjClone(this.outEntities, outEntity);
  return this.updateProps({
    outEntities: nextOutEntities,
  });
}
export function setInEntities(this: StateVarb, entities: InEntities) {
  const value = this.value("numObj");
  return this.updateProps({
    value: value.updateCore({ entities }),
  });
}
