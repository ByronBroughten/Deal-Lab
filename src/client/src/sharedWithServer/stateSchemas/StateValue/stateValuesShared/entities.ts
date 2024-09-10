import { pick } from "lodash";
import { FeVarbInfo } from "../../../StateGetters/Identifiers/FeInfo";
import {
  validateInEntityInfoCustom,
  validateInEntityInfoFixed,
  ValueCustomVarbPathInfo,
  ValueFixedVarbPathInfo,
  ValueInEntityInfo,
} from "../../../StateGetters/Identifiers/ValueInEntityInfo";
import { Arr } from "../../../utils/Arr";
import { IdS } from "../../../utils/IdS";
import { Obj } from "../../../utils/Obj";
import { validateS } from "../../../utils/validateS";
import { PathInVarbInfo } from "../../derivedFromChildrenSchemas/RelInOutVarbInfo";

export function validateEntityId(value: any): string {
  return IdS.validate(value);
}
export type EntityIdProp = { entityId: string };
export type OutEntity = FeVarbInfo & EntityIdProp;

interface InEntityBase {
  entityId: string;
  entitySource: EntitySource;
  length: number;
  offset: number;
}

function validateInEntityBase(value: any): InEntityBase {
  const obj = Obj.validateObjToAny(value) as InEntityBase;
  return {
    entityId: IdS.validate(obj.entityId),
    entitySource: validateValueInEntitySource(obj.entitySource),
    length: validateS.number(obj.length),
    offset: validateS.number(obj.offset),
  };
}

function validateFixedValueInEntity(value: any): ValueInEntityFixed {
  const obj = Obj.validateObjToAny(value) as ValueInEntityFixed;
  return {
    ...validateInEntityInfoFixed(obj),
    ...validateInEntityBase(obj),
  };
}
function validateCustomValueInEntity(value: any): ValueInEntityCustom {
  const obj = Obj.validateObjToAny(value) as ValueInEntityCustom;
  return {
    ...validateInEntityInfoCustom(obj),
    ...validateInEntityBase(obj),
  };
}
function validateValueInEntity(value: any): ValueInEntity {
  if ((value as ValueInEntity).infoType === "varbPathName") {
    return validateFixedValueInEntity(value);
  } else if ((value as ValueInEntity).infoType === "varbPathDbId") {
    return validateCustomValueInEntity(value);
  } else {
    throw new Error(`value.infoType "${value.infoType}" is not valid.`);
  }
}

export function validateValueInEntities(value: any): ValueInEntity[] {
  const arr = Arr.validateIsArray(value);
  arr.forEach((item) => validateValueInEntity(item));
  return arr;
}

interface ValueInEntityFixed extends ValueFixedVarbPathInfo, InEntityBase {}
interface ValueInEntityCustom extends ValueCustomVarbPathInfo, InEntityBase {}

export type ValueInEntity = ValueInEntityFixed | ValueInEntityCustom;

type FixedInEntityInfo = PathInVarbInfo;
export type FixedInEntity = FixedInEntityInfo & EntityIdProp;
export type InEntity = FixedInEntity | ValueInEntity;

const entitySourceNames = ["localValueEntityInfo", "editor"] as const;
export type EntitySource = (typeof entitySourceNames)[number];
export function validateValueInEntitySource(value: any): EntitySource {
  if (entitySourceNames.includes(value)) {
    return value;
  } else {
    throw new Error(`value "${value}" is not an entitySourceName`);
  }
}

export const entityS = {
  valueInEntity(
    varbInfo: ValueInEntityInfo,
    entityInfo: {
      offset: number;
      length: number;
      entitySource: EntitySource;
    }
  ): InEntity {
    return {
      entityId: IdS.make(),
      ...varbInfo,
      ...entityInfo,
    };
  },
  outEntity(feVarbInfo: FeVarbInfo, inEntity: ValueInEntity): OutEntity {
    return {
      ...feVarbInfo,
      ...pick(inEntity, ["entityId"]),
    };
  },
  inEntitiesHas(entities: ValueInEntity[], entity: ValueInEntity): boolean {
    return Arr.has(entities, (e) => e.entityId === entity.entityId);
  },
} as const;

export type EntityMapData = ValueInEntityInfo & EntityIdProp;
export interface OutEntityInfo extends EntityIdProp {
  feId: string;
  varbName: string;
}
