import { DistributiveOmit } from "../../utils/types";
import {
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
  PathNameVarbInfoMixed,
} from "../SectionInfo/PathNameInfo";
import { RelSectionInfo } from "../SectionInfo/RelInfo";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
} from "../SectionInfo/VarbPathNameInfo";
import { SectionName } from "../SectionName";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../sectionPathContexts/sectionPathNames";

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
      sectionName,
      id: feId,
    };
  },
  globalSection<SN extends SectionName>(
    sectionName: SN
  ): GlobalSectionInfo<SN> {
    return {
      infoType: "globalSection",
      sectionName,
    };
  },
  pathName<PN extends SectionPathName>(pathName: PN): PathNameInfoMixed<PN> {
    return {
      infoType: "pathName",
      pathName: pathName as any,
    };
  },
  varbPathName<VPN extends VarbPathName>(
    varbPathName: VPN
  ): VarbPathNameInfoMixed<VPN> {
    return {
      infoType: "varbPathName",
      varbPathName,
    };
  },
  pathNameVarb<PN extends SectionPathName, VN extends SectionPathVarbName<PN>>(
    pathName: PN,
    varbName: VN
  ): PathNameVarbInfoMixed {
    return {
      ...this.pathName(pathName),
      varbName,
    } as PathNameVarbInfoMixed;
  },
  pathNameDbId<PN extends SectionPathName>(
    pathName: PN,
    dbId: string
  ): PathNameDbInfoMixed<PN> {
    return {
      infoType: "pathNameDbId",
      pathName,
      id: dbId,
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
  makeDb<S extends SectionName>(
    sectionName: S,
    dbId: string
  ): DbSectionInfoMixed<S> {
    return {
      sectionName,
      id: dbId,
      infoType: "dbId",
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
