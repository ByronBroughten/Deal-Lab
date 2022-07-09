import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { isSectionName } from "../../baseSections";
import { isVarbName } from "../../baseSectionsDerived/baseVarbInfo";
import { Id } from "../id";
import { InEntityVarbInfo, zInEntity } from "./entities";

export type InEntityVarbInfoValue = InEntityVarbInfo | null;
export const zInEntityVarbInfoValue = z.union([z.null(), zInEntity]);
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
    isSectionName(info.sectionName)
  );
}
function isInEntityVarbInfoSpecific(value: any): boolean {
  const info: InEntityVarbInfo = value;
  return (
    (info.infoType === "dbId" && Id.is(info.id)) ||
    info.infoType === "globalSection"
  );
}
