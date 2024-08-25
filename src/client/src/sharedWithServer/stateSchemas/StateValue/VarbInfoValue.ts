import { z } from "zod";
import { VarbInfoMixedFocal } from "../../StateGetters/Identifiers/MixedSectionInfo";

export type VarbInfoValue = (VarbInfoMixedFocal & { entityId: string }) | null;
function isVarbInfoValue(value: any): value is VarbInfoValue {
  return true;
}
const zVarbInfoValue = z.any();
export const varbInfoValueMeta = {
  is: isVarbInfoValue,
  initDefault: () => null as VarbInfoValue,
  zod: zVarbInfoValue,
};
