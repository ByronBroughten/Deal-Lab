import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import array from "../../../utils/Arr";
import StateVarb from "../StateVarb";
import {
  InEntities,
  InEntity,
} from "../../SectionMetas/relSections/rel/relValue/numObj/entities";

// all varbs that may have inEntities are in mutable sections.
// so all outEntities (which point to the varbs with inEntities)
// are FeVarbInfos rather than static.
export type OutEntity = FeVarbInfo;
export type OutEntities = OutEntity[];
export function findInEntity(
  this: StateVarb,
  entityId: string
): InEntity | undefined {
  return array.findIn(
    this.inEntities,
    (entity) => entity.entityId === entityId
  );
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
export function addOutEntity(this: StateVarb, entity: OutEntity): StateVarb {
  if (!array.objIsIn(entity, this.outEntities)) {
    return this.updateProps({
      outEntities: [...this.outEntities, entity],
    });
  } else return this;
}
export function removeOutEntity(
  this: StateVarb,
  outEntity: OutEntity
): StateVarb {
  const nextOutEntities = array.rmLikeObjClone(this.outEntities, outEntity);
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
