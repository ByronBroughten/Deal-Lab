import { DistributiveOmit } from "../../utils/types";
import {
  ActiveDealInfo,
  DbSectionInfoMixed,
  FeSectionInfoMixed,
  FeVarbInfoMixed,
  GlobalSectionInfo,
  VarbProp,
} from "../baseSectionsDerived/baseVarbInfo";
import { ExpectedCount } from "../baseSectionsVarbs/NanoIdInfo";
import { ChildPathName, childPaths } from "../childPaths";
import { PathDbInfoMixed, PathInfoMixed, PathVarbInfoMixed } from "../PathInfo";
import { SectionName } from "../SectionName";
import { RelSectionInfo } from "./RelInfo";

export type SectionContextInfo<SN extends SectionName = SectionName> =
  ActiveDealInfo<SN>;

// a mixed section finder that doesn't need a focal section
export type SectionInfoMixed<SN extends SectionName = SectionName> =
  | FeSectionInfoMixed<SN>
  | GlobalSectionInfo<SN>
  | DbSectionInfoMixed<SN>
  | PathInfoMixed<SN>
  | PathDbInfoMixed<SN>;

export type IdInfoMixedMulti = DistributiveOmit<
  FeSectionInfoMixed | GlobalSectionInfo | DbSectionInfoMixed,
  "sectionName"
>;

export type VarbInfoMixed<SN extends SectionName = SectionName> =
  SectionInfoMixed<SN> & VarbProp;

export const mixedInfoS = {
  makeFe<SN extends SectionName>(
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
  globalSection<SN extends SectionName, EC extends ExpectedCount = "onlyOne">(
    sectionName: SN,
    expectedCount?: EC
  ): GlobalSectionInfo<SN, EC> {
    return {
      infoType: "globalSection",
      sectionName,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  absolutePath<SN extends SectionName, EC extends ExpectedCount = "onlyOne">(
    sectionName: SN,
    childPathName: ChildPathName,
    expectedCount?: EC
  ): PathInfoMixed<SN, EC> {
    return {
      infoType: "absolutePath",
      sectionName,
      sectionPath: childPaths[childPathName].path,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  absoluteVarbPath<
    SN extends SectionName,
    EC extends ExpectedCount = "onlyOne"
  >(
    sectionName: SN,
    childPathName: ChildPathName,
    varbName: string,
    expectedCount?: EC
  ): PathVarbInfoMixed<SN, EC> {
    return {
      ...this.absolutePath(sectionName, childPathName, expectedCount),
      varbName,
    };
  },
  absoluteDbIdPath<SN extends SectionName, EC extends ExpectedCount>(
    sectionName: SN,
    childPathName: ChildPathName,
    dbId: string,
    expectedCount: EC
  ): PathDbInfoMixed<SN, EC> {
    return {
      infoType: "absolutePathDbId",
      id: dbId,
      sectionName,
      sectionPath: childPaths[childPathName].path,
      expectedCount,
    };
  },
  makeActiveDeal<SN extends SectionName, EC extends ExpectedCount = "onlyOne">(
    sectionName: SN,
    expectedCount?: EC
  ): ActiveDealInfo<SN, EC> {
    return {
      infoType: "activeDeal",
      sectionName,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  makeFeVarb<SN extends SectionName>(
    sectionName: SN,
    feId: string,
    varbName: string
  ): FeVarbInfoMixed<SN> {
    return {
      ...this.makeFe(sectionName, feId),
      varbName,
    };
  },
  makeDb<S extends SectionName, EC extends ExpectedCount = "multiple">(
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

// may point to multiple sections and may require focal section
export type SectionInfoMixedFocal = SectionInfoMixed | RelSectionInfo;
export type VarbInfoMixedFocal = SectionInfoMixedFocal & VarbProp;
