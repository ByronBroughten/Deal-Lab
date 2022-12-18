import { z } from "zod";
import { zS } from "../utils/zod";
import {
  ChildPathName,
  PathNameOfSection,
  PathSectionName,
} from "./absoluteVarbPaths";
import { SectionNameProp } from "./baseSectionsDerived/baseSectionInfo";
import { VarbProp, VarbPropNext } from "./baseSectionsDerived/baseVarbInfo";
import {
  ExpectedCount,
  GeneralMixedIdInfo,
  GeneralMixedInfo,
} from "./baseSectionsVarbs/NanoIdInfo";
import { SectionName } from "./SectionName";

interface PathNameProp<PN extends ChildPathName> {
  pathName: PN;
}

interface SectionPathProp<SN extends SectionName>
  extends PathNameProp<PathNameOfSection<SN>> {}

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

export interface PathInfo<PN extends ChildPathName>
  extends PathNameProp<PN>,
    SectionNameProp<PathSectionName<PN>> {}
export interface SectionPathInfo<SN extends SectionName>
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
> extends SectionPathInfo<SN>,
    PathMixedProp<EC> {}

export interface PathVarbNames<PN extends ChildPathName>
  extends PathNameProp<PN>,
    VarbProp {}

export interface PathVarbInfo<PN extends ChildPathName>
  extends PathInfo<PN>,
    VarbPropNext<PathSectionName<PN>> {}
export interface SectionPathVarbInfo<SN extends SectionName>
  extends SectionPathInfo<SN>,
    VarbProp {}

export interface PathVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends SectionPathVarbInfo<SN>,
    PathMixedProp<EC> {}

export interface PathDbIdInfo<SN extends SectionName>
  extends SectionPathInfo<SN> {
  dbId: string;
}

export interface PathDbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends SectionPathInfo<SN>,
    GeneralMixedIdInfo<EC>,
    PathInfoTypeProp {
  infoType: "absolutePathDbId";
}

export interface PathDbVarbInfo<SN extends SectionName>
  extends SectionPathVarbInfo<SN> {
  dbId: string;
}

export interface PathDbVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends SectionPathVarbInfo<SN>,
    GeneralMixedIdInfo<EC> {
  infoType: "absolutePathDbId";
}
