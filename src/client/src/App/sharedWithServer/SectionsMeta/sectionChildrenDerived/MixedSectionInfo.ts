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
import {
  PathDbInfoMixed,
  PathInfoMixed,
} from "../SectionInfo/AbsolutePathInfo";
import { RelSectionInfo } from "../SectionInfo/RelInfo";
import { SectionName } from "../SectionName";
import {
  PathNameOfSection,
  PathSectionName,
  sectionNameByPathName,
  SectionPathName,
} from "../sectionPathContexts/sectionPathNames";

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
  absolutePath<
    PN extends SectionPathName,
    EC extends ExpectedCount = "onlyOne"
  >(pathName: PN, expectedCount?: EC): PathInfoMixed<PathSectionName<PN>, EC> {
    return {
      infoType: "absolutePath",
      sectionName: sectionNameByPathName(pathName),
      pathName: pathName as any,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  absoluteVarbPath<
    PN extends SectionPathName,
    EC extends ExpectedCount = "onlyOne"
  >(pathName: PN, varbName: string, expectedCount?: EC) {
    return {
      ...this.absolutePath(pathName, expectedCount),
      varbName,
    };
  },
  absoluteDbIdPath<SN extends PathSectionName, EC extends ExpectedCount>(
    sectionName: SN,
    pathName: PathNameOfSection<SN>,
    dbId: string,
    expectedCount: EC
  ): PathDbInfoMixed<SN, EC> {
    return {
      infoType: "absolutePathDbId",
      id: dbId,
      sectionName,
      pathName,
      expectedCount,
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
