import { z } from "zod";
import { zS } from "../../utils/zod";
import { SimpleSectionName } from "../baseSections";
import { FeIdInfo } from "../baseSectionsUtils/NanoIdInfo";

export interface SectionNameProp<SN extends SimpleSectionName> {
  sectionName: SN;
}
export const zSectionNameProp = z.object({ sectionName: zS.string });

export interface FeMixedInfo<SN extends SimpleSectionName = SimpleSectionName>
  extends FeIdInfo,
    SectionNameProp<SN> {}
