import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { isVarbName } from "../../baseSectionsDerived/baseVarbInfo";
import { isSectionName } from "../../SectionName";
import { Id } from "../id";
import { InEntityVarbInfo, zInEntityVarbInfo } from "./entities";

export type InEntityInfo = InEntityVarbInfo & { entityId: string };
const zInEntityValueInfo = zInEntityVarbInfo.and(
  z.object({ entityId: zS.nanoId })
);

export function inEntityInfo(varbInfo: InEntityVarbInfo): InEntityInfo {
  return {
    ...varbInfo,
    entityId: Id.make(),
  };
}

export type InEntityInfoValue = InEntityInfo | null;
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
): value is InEntityInfoValue {
  return (
    value === null ||
    (isInEntityVarbInfoShared(value) && isInEntityVarbInfoSpecific(value))
  );
}
function isInEntityVarbInfoShared(value: any): boolean {
  const info: InEntityVarbInfo = value;
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
  return (
    (info.infoType === "dbId" && Id.is(info.id)) ||
    info.infoType === "globalSection"
  );
}
