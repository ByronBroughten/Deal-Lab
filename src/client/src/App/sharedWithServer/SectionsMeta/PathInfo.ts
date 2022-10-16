import { z } from "zod";
import { zS } from "../utils/zod";
import { SectionNameProp } from "./baseSectionsDerived/baseSectionInfo";
import { VarbProp } from "./baseSectionsDerived/baseVarbInfo";
import {
  ExpectedCount,
  GeneralMixedIdInfo,
  GeneralMixedInfo,
} from "./baseSectionsVarbs/NanoIdInfo";
import { PathNameOfSection } from "./childPaths";
import { SectionName } from "./SectionName";

interface SectionPathProp<SN extends SectionName> {
  pathName: PathNameOfSection<SN>;
}

export const zSectionPathProp = z.object({
  pathName: zS.string,
});
export function isSectionPath(value: any) {
  return Array.isArray(value) && value.every((val) => typeof val === "string");
}

const pathInfoTypes = ["absolutePath", "absolutePathDbId"] as const;
type PathInfoType = typeof pathInfoTypes[number];
type PathInfoTypeProp = {
  infoType: PathInfoType;
};

export function isAbsoluteInfoType(value: any): value is PathInfoType {
  return pathInfoTypes.includes(value);
}

export interface PathInfo<SN extends SectionName>
  extends SectionNameProp<SN>,
    SectionPathProp<SN> {}

interface PathMixedProp<EC extends ExpectedCount = ExpectedCount>
  extends GeneralMixedInfo<EC>,
    PathInfoTypeProp {
  infoType: "absolutePath";
}

export interface PathInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends PathInfo<SN>,
    PathMixedProp<EC> {}

export interface PathVarbInfo<SN extends SectionName>
  extends PathInfo<SN>,
    VarbProp {}

export interface PathVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends PathVarbInfo<SN>,
    PathMixedProp<EC> {}

export interface PathDbIdInfo<SN extends SectionName> extends PathInfo<SN> {
  dbId: string;
}

export interface PathDbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends PathInfo<SN>,
    GeneralMixedIdInfo<EC>,
    PathInfoTypeProp {
  infoType: "absolutePathDbId";
}

export interface PathDbVarbInfo<SN extends SectionName>
  extends PathVarbInfo<SN> {
  dbId: string;
}

export interface PathDbVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends PathVarbInfo<SN>,
    GeneralMixedIdInfo<EC> {
  infoType: "absolutePathDbId";
}
