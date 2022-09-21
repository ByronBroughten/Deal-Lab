import { z } from "zod";
import { zS } from "../../utils/zod";
import { SectionName } from "../SectionName";

export interface SectionNameProp<SN extends SectionName> {
  sectionName: SN;
}
export const zSectionNameProp = z.object({ sectionName: zS.string });
