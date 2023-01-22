import { DistributiveOmit } from "../../utils/types";
import { ExpectedCount } from "../allBaseSectionVarbs/NanoIdInfo";
import {
  ActiveDealInfo,
  DbSectionInfoMixed,
  FeSectionInfoMixed,
  FeVarbInfoMixed,
  GlobalSectionInfo,
  VarbProp,
} from "../baseSectionsDerived/baseVarbInfo";
import {
  AbsolutePathDbInfoMixed,
  AbsolutePathInfoMixed,
} from "../SectionInfo/AbsolutePathInfo";
import {
  PathNameDbInfoMixed,
  PathNameInfoMixed,
} from "../SectionInfo/PathNameInfo";
import { RelSectionInfo } from "../SectionInfo/RelInfo";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
} from "../SectionInfo/VarbPathNameInfo";
import { SectionName } from "../SectionName";
import {
  PathNameOfSection,
  PathSectionName,
  pathSectionName,
  SectionPathName,
} from "../sectionPathContexts/sectionPathNames";

export type SectionContextInfo<SN extends SectionName = SectionName> =
  ActiveDealInfo<SN>;

// a mixed section finder that doesn't need a focal section
export type SectionInfoMixed<SN extends SectionName = SectionName> =
  | FeSectionInfoMixed<SN>
  | GlobalSectionInfo<SN>
  | DbSectionInfoMixed<SN>
  | AbsolutePathInfoMixed<SN>
  | AbsolutePathDbInfoMixed<SN>;

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
  pathName<PN extends SectionPathName, EC extends ExpectedCount = "onlyOne">(
    pathName: PN,
    expectedCount?: EC
  ): PathNameInfoMixed<PathSectionName<PN>, EC> {
    return {
      infoType: "pathName",
      sectionName: pathSectionName(pathName),
      pathName: pathName as any,
      expectedCount: (expectedCount ?? "onlyOne") as EC,
    };
  },
  varbPathName<VPN extends VarbPathName, EC extends ExpectedCount = "onlyOne">(
    varbPathName: VPN,
    expectedCount?: EC
  ): VarbPathNameInfoMixed<VPN, EC> {
    return {
      infoType: "varbPathName",
      varbPathName,
      expectedCount: expectedCount ?? ("onlyOne" as EC),
    };
  },
  pathNameVarb<
    PN extends SectionPathName,
    EC extends ExpectedCount = "onlyOne"
  >(pathName: PN, varbName: string, expectedCount?: EC) {
    return {
      ...this.pathName(pathName, expectedCount),
      varbName,
    };
  },
  pathNameDbId<SN extends PathSectionName, EC extends ExpectedCount>(
    sectionName: SN,
    pathName: PathNameOfSection<SN>,
    dbId: string,
    expectedCount: EC
  ): PathNameDbInfoMixed<SN, EC> {
    return {
      infoType: "pathNameDbId",
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

export type SectionInfoMixedFocal =
  | SectionInfoMixed
  | RelSectionInfo
  | PathNameInfoMixed
  | PathNameDbInfoMixed;

type SectionToVarbInfoMixed = SectionInfoMixedFocal & VarbProp;
export type VarbInfoMixedFocal = SectionToVarbInfoMixed | VarbPathNameInfoMixed;
