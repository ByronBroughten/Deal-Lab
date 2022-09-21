import { z } from "zod";
import { zS } from "../../utils/zod";
import { SimpleSectionName } from "../baseSectionsVarbs";

export interface SectionNameProp<SN extends SimpleSectionName> {
  sectionName: SN;
}
export const zSectionNameProp = z.object({ sectionName: zS.string });
