import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { isVarbPathName } from "../../SectionInfo/VarbPathNameInfo";
import { isSectionPathName } from "../../sectionPathContexts/sectionPathNames";
import { Id } from "../id";
import { EntityIdProp, ValueInEntityInfo, zValueEntityInfo } from "./entities";

export type ValueIdInEntityInfo = ValueInEntityInfo & EntityIdProp;
const zInEntityValueInfo = zValueEntityInfo.and(
  z.object({ entityId: zS.nanoId })
);

export function inEntityIdInfo(
  varbInfo: ValueInEntityInfo
): ValueIdInEntityInfo {
  return {
    ...varbInfo,
    entityId: Id.make(),
  };
}

export type InEntityIdInfoValue = ValueIdInEntityInfo | null;
export const zInEntityVarbInfoValue = z.union([z.null(), zInEntityValueInfo]);
export const mInEntityVarbInfoValue = {
  type: Schema.Types.Mixed,
  required: false,
  validate: {
    validator: (v: any) => zInEntityVarbInfoValue.safeParse(v).success,
  },
};

export function isInEntityVarbInfoValue(
  value: any
): value is InEntityIdInfoValue {
  return value === null || (isShared(value) && isSpecificInfoType(value));
}
function isShared(value: any): boolean {
  const info: ValueInEntityInfo = value;
  return Obj.isObjToAny(info) && Id.is(value.entityId);
}
function isSpecificInfoType(value: any): boolean {
  const info: ValueInEntityInfo = value;
  switch (info.infoType) {
    case "varbPathName": {
      return isVarbPathName(info.varbPathName);
    }
    case "pathNameDbId": {
      return isSectionPathName(info.pathName) && Id.is(info.id);
    }
    default: {
      throw new Error(
        `infoType ${(info as ValueInEntityInfo).infoType} is unhandled.`
      );
    }
  }
}

export const inEntityInfoValueSchema = {
  is: isInEntityVarbInfoValue,
  initDefault: () => null as InEntityIdInfoValue,
  zod: zInEntityVarbInfoValue,
  mon: mInEntityVarbInfoValue,
};
