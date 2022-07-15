import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { isSectionName } from "../../baseSections";
import { isVarbName } from "../../baseSectionsDerived/baseVarbInfo";
import { Id } from "../id";
import { InEntityVarbInfo, zInEntityVarbInfo } from "./entities";

export type InEntityValueInfo = InEntityVarbInfo & { entityId: string };
const zInEntityValueInfo = zInEntityVarbInfo.and(
  z.object({ entityId: zS.nanoId })
);

export type InEntityVarbInfoValue = InEntityValueInfo | null;
export const zInEntityVarbInfoValue = z.union([z.null(), zInEntityValueInfo]);
export const mInEntityVarbInfoValue = {
  type: Schema.Types.Mixed,
  required: true,
  validate: {
    validator: (v: any) => zInEntityVarbInfoValue.safeParse(v).success,
  },
};

export function isInEntityVarbInfoValue(
  value: any
): value is InEntityVarbInfoValue {
  return (
    value === null ||
    (isInEntityVarbInfoShared(value) && isInEntityVarbInfoSpecific(value))
  );
}
function isInEntityVarbInfoShared(value: any): boolean {
  const info: InEntityVarbInfo = value;
  return (
    Obj.isAnyIfIsObj(info) &&
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
