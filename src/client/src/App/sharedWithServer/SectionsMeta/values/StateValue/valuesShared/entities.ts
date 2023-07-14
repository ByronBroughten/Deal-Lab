import { pick } from "lodash";
import { z } from "zod";
import {
  validateInEntityInfoCustom,
  validateInEntityInfoFixed,
  ValueCustomVarbPathInfo,
  ValueFixedVarbPathInfo,
  ValueInEntityInfo,
} from "../../../../StateEntityGetters/ValueInEntityInfo";
import { Arr } from "../../../../utils/Arr";
import { Obj } from "../../../../utils/Obj";
import { zS } from "../../../../utils/zod";
import { validateS } from "../../../../validateS";
import { Id } from "../../../IdS";
import { PathInVarbInfo } from "../../../sectionChildrenDerived/RelInOutVarbInfo";
import { FeVarbInfo } from "../../../SectionInfo/FeInfo";
import { PathDbVarbInfoMixed } from "../../../SectionInfo/PathNameInfo";
import { VarbPathNameInfoMixed } from "../../../SectionInfo/VarbPathNameInfo";

export function validateEntityId(value: any): string {
  return Id.validate(value);
}
export type EntityIdProp = { entityId: string };
export type OutEntity = FeVarbInfo & EntityIdProp;

const varbPathZSchema: Record<keyof VarbPathNameInfoMixed, any> = {
  infoType: z.literal("varbPathName"),
  varbPathName: zS.string,
};

const pathDbIdZSchema: Record<keyof PathDbVarbInfoMixed, any> = {
  infoType: z.literal("pathNameDbId"),
  pathName: zS.string,
  varbName: zS.string,
  id: zS.nanoId,
};

interface InEntityBase {
  entityId: string;
  entitySource: EntitySource;
  length: number;
  offset: number;
}

function validateInEntityBase(value: any): InEntityBase {
  const obj = Obj.validateObjToAny(value) as InEntityBase;
  return {
    entityId: Id.validate(obj.entityId),
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
      entityId: Id.make(),
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

const zValueInEntityBase = z.object({
  entityId: zS.nanoId,
  entitySource: zS.string,
  length: zS.number,
  offset: zS.number,
});

const zValueInEntity = z.union([
  zValueInEntityBase.extend(varbPathZSchema),
  zValueInEntityBase.extend(pathDbIdZSchema),
]);

export const zValueInEntities = z.array(zValueInEntity);

export const zValueEntityInfo = z.union([
  z.object(varbPathZSchema),
  z.object(pathDbIdZSchema),
]);
