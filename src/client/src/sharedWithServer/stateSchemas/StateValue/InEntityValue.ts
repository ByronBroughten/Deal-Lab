import { z } from "zod";
import {
  validateInEntityInfo,
  ValueInEntityInfo,
} from "../../StateGetters/Identifiers/ValueInEntityInfo";
import { isVarbPathName } from "../../StateGetters/Identifiers/VarbPathNameInfo";
import { IdS } from "../../utils/IdS";
import { Obj } from "../../utils/Obj";
import { zS } from "../../utils/zod";
import {
  EntityIdProp,
  validateEntityId,
  zValueEntityInfo,
} from "./stateValuesShared/entities";

export type InEntityValue = InEntityValueInfo | null;

export type InEntityValueInfo = ValueInEntityInfo & EntityIdProp;
export function inEntityValueInfo(
  varbInfo: ValueInEntityInfo
): InEntityValueInfo {
  return {
    ...varbInfo,
    entityId: IdS.make(),
  };
}

export function validateInEntityValue(value: any): InEntityValue {
  if (value === null) return value;
  return {
    entityId: validateEntityId((value as InEntityValue)?.entityId),
    ...validateInEntityInfo(value),
  };
}

function isInEntityValue(value: any): value is InEntityValue {
  return value === null || (generalCheck(value) && infoTypeCheck(value));
}
function generalCheck(value: any): boolean {
  const info: ValueInEntityInfo = value;
  return Obj.isObjToAny(info) && IdS.is(value.entityId);
}
function infoTypeCheck(value: any): boolean {
  const info: ValueInEntityInfo = value;
  switch (info.infoType) {
    case "varbPathName": {
      return isVarbPathName(info.varbPathName);
    }
    case "varbPathDbId": {
      return isVarbPathName(info.varbPathName) && IdS.is(info.dbId);
    }
    default: {
      throw new Error(
        `infoType ${(info as ValueInEntityInfo).infoType} is unhandled.`
      );
    }
  }
}

const zInEntityValueInfo = zValueEntityInfo.and(
  z.object({ entityId: zS.nanoId })
);
const zInEntityVarbInfoValue = z.union([z.null(), zInEntityValueInfo]);

export const inEntityInfoValueSchema = {
  is: isInEntityValue,
  initDefault: () => null as InEntityValue,
  validate: validateInEntityValue,
  zod: zInEntityVarbInfoValue,
};
