import { DistributiveOmit } from "../../utils/types";
import {
  ChildPathName,
  PathNameOfSection,
  pathSectionName,
  PathSectionName,
} from "../absoluteVarbPaths";
import {
  ActiveDealInfo,
  DbSectionInfoMixed,
  FeSectionInfoMixed,
  FeVarbInfoMixed,
  GlobalSectionInfo,
  VarbProp,
} from "../baseSectionsDerived/baseVarbInfo";
import { ExpectedCount } from "../baseSectionsVarbs/NanoIdInfo";
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
  absolutePath<
    SN extends PathSectionName,
    EC extends ExpectedCount = "onlyOne"
  >(
    sectionName: SN,
    pathName: PathNameOfSection<SN>,
    expectedCount?: EC
  ): PathInfoMixed<SN, EC> {
    return {
      infoType: "absolutePath",
      sectionName,
      pathName,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  absolutePathNext<
    PN extends ChildPathName,
    EC extends ExpectedCount = "onlyOne"
  >(pathName: PN, expectedCount?: EC): PathInfoMixed<PathSectionName<PN>, EC> {
    return {
      infoType: "absolutePath",
      sectionName: pathSectionName(pathName),
      pathName: pathName as any,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  absoluteVarbPathNext<
    PN extends ChildPathName,
    EC extends ExpectedCount = "onlyOne"
  >(pathName: PN, varbName: string, expectedCount?: EC) {
    return {
      ...this.absolutePathNext(pathName, expectedCount),
      varbName,
    };
  },
  absoluteVarbPath<
    SN extends PathSectionName,
    EC extends ExpectedCount = "onlyOne"
  >(
    sectionName: SN,
    pathName: PathNameOfSection<SN>,
    varbName: string,
    expectedCount?: EC
  ): PathVarbInfoMixed<SN, EC> {
    return {
      ...this.absolutePath(sectionName, pathName, expectedCount),
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
