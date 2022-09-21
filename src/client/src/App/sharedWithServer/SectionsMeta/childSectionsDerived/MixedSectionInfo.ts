import { DistributiveOmit } from "../../utils/types";
import {
  DbSectionInfoMixed,
  FeSectionInfoMixed,
  FeVarbInfoMixed,
  GlobalSectionInfo,
  VarbProp,
} from "../baseSectionsDerived/baseVarbInfo";
import { ExpectedCount } from "../baseSectionsUtils/NanoIdInfo";
import { SimpleSectionName } from "../baseSectionsVarbs";
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
  makeGlobalSection<
    SN extends SimpleSectionName,
    EC extends ExpectedCount = "onlyOne"
  >(sectionName: SN, expectedCount?: EC): GlobalSectionInfo<SN, EC> {
    return {
      infoType: "globalSection",
      sectionName,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
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
  makeDb<S extends SimpleSectionName, EC extends ExpectedCount = "multiple">(
    sectionName: S,
    dbId: string,
    expectedCount: EC
  ): DbSectionInfoMixed<S, EC> {
    return {
      sectionName,
      id: dbId,
      infoType: "dbId",
      expectedCount: expectedCount ?? "multiple",
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
