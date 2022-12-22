import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { isVarbName } from "../../baseSectionsDerived/baseVarbInfo";
import { isSectionName } from "../../SectionName";
import { isSectionPathName } from "../../sectionPathContexts/sectionPathNames";
import { Id } from "../id";
import {
  InEntityVarbInfo,
  ValueInEntityInfo,
  zInEntityVarbInfo,
} from "./entities";

export type ValueIdInEntityInfo = ValueInEntityInfo & { entityId: string };
const zInEntityValueInfo = zInEntityVarbInfo.and(
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
  return (
    value === null ||
    (isInEntityVarbInfoShared(value) && isInEntityVarbInfoSpecific(value))
  );
}
function isInEntityVarbInfoShared(value: any): boolean {
  const info: ValueInEntityInfo = value;
  return (
    Obj.isObjToAny(info) &&
    info.expectedCount === "onlyOne" &&
    isVarbName(info.varbName) &&
    isSectionName(info.sectionName) &&
    Id.is(value.entityId)
  );
}
function isInEntityVarbInfoSpecific(value: any): boolean {
  const info: InEntityVarbInfo = value;
  switch (info.infoType) {
    case "globalSection":
      return true;
    case "dbId":
      return Id.is(info.id);
    case "absolutePath": {
      return isSectionPathName(info.pathName);
    }
    case "absolutePathDbId": {
      return isSectionPathName(info.pathName) && Id.is(info.id);
    }
    default:
      return false;
  }
}
