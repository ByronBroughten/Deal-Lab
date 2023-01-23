import { z } from "zod";
import { zS } from "../../utils/zod";
import {
  ExpectedCount,
  GeneralMixedIdInfo,
  GeneralMixedInfo,
} from "../allBaseSectionVarbs/NanoIdInfo";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { VarbProp, VarbPropNext } from "../baseSectionsDerived/baseVarbInfo";
import { SectionName } from "../SectionName";
import {
  PathNameOfSection,
  SectionNameOfPath,
  SectionPathName,
} from "../sectionPathContexts/sectionPathNames";

interface PathNameProp<PN extends SectionPathName> {
  pathName: PN;
}

interface SectionPathNameProp<SN extends SectionName>
  extends PathNameProp<PathNameOfSection<SN>> {}

export const zSectionPathProp = z.object({
  pathName: zS.string,
});
export function isSectionPath(value: any) {
  return Array.isArray(value) && value.every((val) => typeof val === "string");
}

const pathNameInfoTypes = ["pathName", "pathNameDbId"] as const;
type PathNameInfoType = typeof pathNameInfoTypes[number];
type PathNameInfoTypeProp = {
  infoType: PathNameInfoType;
};

export function isPathInfoType(value: any): value is PathNameInfoType {
  return pathNameInfoTypes.includes(value);
}

interface PathNameInfo<PN extends SectionPathName = SectionPathName>
  extends PathNameProp<PN>,
    SectionNameProp<SectionNameOfPath<PN>> {}

export interface SectionPathNameInfo<SN extends SectionName>
  extends SectionNameProp<SN>,
    SectionPathNameProp<SN> {}

// It will be SectionPathNameInfo

interface PathMixedProp<EC extends ExpectedCount = ExpectedCount>
  extends GeneralMixedInfo<EC>,
    PathNameInfoTypeProp {
  infoType: "pathName";
}

export interface PathNameInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends SectionPathNameInfo<SN>,
    PathMixedProp<EC> {}

export interface PathVarbNames<PN extends SectionPathName>
  extends PathNameProp<PN>,
    VarbProp {}

export interface PathNameVarbInfoNext<PN extends SectionPathName>
  extends PathNameInfo<PN>,
    VarbPropNext<SectionNameOfPath<PN>> {}

export interface PathNameVarbInfo<SN extends SectionName = SectionName>
  extends SectionPathNameInfo<SN>,
    VarbProp {}

export interface PathNameVarbInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends PathNameVarbInfo<SN>,
    PathMixedProp<EC> {}

export interface PathNameDbInfo<SN extends SectionName>
  extends SectionPathNameInfo<SN> {
  dbId: string;
}

export interface PathNameDbInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends SectionPathNameInfo<SN>,
    GeneralMixedIdInfo<EC>,
    PathNameInfoTypeProp {
  infoType: "pathNameDbId";
}

export interface PathDbVarbInfo<SN extends SectionName>
  extends PathNameVarbInfo<SN> {
  dbId: string;
}

export interface PathDbVarbInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends PathNameVarbInfo<SN>,
    GeneralMixedIdInfo<EC> {
  infoType: "pathNameDbId";
}
