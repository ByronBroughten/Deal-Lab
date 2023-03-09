import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { Id } from "../../id";
import { isVarbPathName } from "../../SectionInfo/VarbPathNameInfo";
import {
  EntityIdProp,
  ValueInEntityInfo,
  zValueEntityInfo,
} from "./valuesShared/entities";

export type InEntityValue = InEntityValueInfo | null;

export type InEntityValueInfo = ValueInEntityInfo & EntityIdProp;
export function inEntityValueInfo(
  varbInfo: ValueInEntityInfo
): InEntityValueInfo {
  return {
    ...varbInfo,
    entityId: Id.make(),
  };
}

function isInEntityValue(value: any): value is InEntityValue {
  return value === null || (generalCheck(value) && infoTypeCheck(value));
}
function generalCheck(value: any): boolean {
  const info: ValueInEntityInfo = value;
  return Obj.isObjToAny(info) && Id.is(value.entityId);
}
function infoTypeCheck(value: any): boolean {
  const info: ValueInEntityInfo = value;
  switch (info.infoType) {
    case "varbPathName": {
      return isVarbPathName(info.varbPathName);
    }
    case "varbPathDbId": {
      return isVarbPathName(info.varbPathName) && Id.is(info.dbId);
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
  zod: zInEntityVarbInfoValue,
  mon: {
    type: Schema.Types.Mixed,
    required: false,
    validate: {
      validator: (v: any) => zInEntityVarbInfoValue.safeParse(v).success,
    },
  },
};
