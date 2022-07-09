import { DistributiveOmit } from "../../utils/types";
import { SimpleSectionName } from "../baseSections";
import {
  DbSectionInfoMixed,
  FeSectionInfoMixed,
  FeVarbInfoMixed,
  GlobalSectionInfo,
  VarbProp,
} from "../baseSectionsDerived/baseVarbInfo";
import { ExpectedCount } from "../baseSectionsUtils/NanoIdInfo";
import { RelSectionInfo } from "./RelInfo";

// a mixed section finder that doesn't need a focal section
export type SectionInfoMixed<SN extends SimpleSectionName = SimpleSectionName> =
  FeSectionInfoMixed<SN> | GlobalSectionInfo<SN> | DbSectionInfoMixed<SN>;
export type VarbInfoMixed<SN extends SimpleSectionName = SimpleSectionName> =
  SectionInfoMixed<SN> & VarbProp;

export const mixedInfoS = {
  makeFe<SN extends SimpleSectionName>(
    sectionName: SN,
    feId: string
  ): FeSectionInfoMixed<SN> {
    return {
      infoType: "feId",
      expectedCount: "onlyOne",
      sectionName,
      id: feId,
    };
  },
  makeFeVarb<SN extends SimpleSectionName>(
    sectionName: SN,
    feId: string,
    varbName: string
  ): FeVarbInfoMixed<SN> {
    return {
      ...this.makeFe(sectionName, feId),
      varbName,
    };
  },
  makeDb<S extends SimpleSectionName>(
    sectionName: S,
    dbId: string,
    expectedCount: ExpectedCount = "multiple"
  ): DbSectionInfoMixed<S> {
    return {
      sectionName,
      id: dbId,
      infoType: "dbId",
      expectedCount,
    };
  },
  get mixedInfoTypes(): MixedInfoType[] {
    return ["feId", "dbId", "globalSection"];
  },
  isMixedInfoType(value: any): value is MixedInfoType {
    return this.mixedInfoTypes.includes(value);
  },
};

type MixedInfoType = SectionInfoMixed["infoType"];
export type IdInfoMultiMixed = DistributiveOmit<
  SectionInfoMixed,
  "sectionName"
>;

// may point to multiple sections and may require focal section
export type SectionInfoMixedFocal = SectionInfoMixed | RelSectionInfo;
export type VarbInfoMixedFocal = SectionInfoMixedFocal & VarbProp;
