import { Schema } from "mongoose";
import { z } from "zod";
import { VarbInfoMixedFocal } from "../../SectionInfo/MixedSectionInfo";

export type VarbInfoValue = (VarbInfoMixedFocal & { entityId: string }) | null;
function isVarbInfoValue(value: any): value is VarbInfoValue {
  return true;
}
const zVarbInfoValue = z.any();
const mVarbInfoValue = {
  type: Schema.Types.Mixed,
  required: false,
  validate: {
    validator: (v: any) => zVarbInfoValue.safeParse(v).success,
  },
};
export const varbInfoValueMeta = {
  is: isVarbInfoValue,
  initDefault: () => null as VarbInfoValue,
  zod: zVarbInfoValue,
  mon: mVarbInfoValue,
};
