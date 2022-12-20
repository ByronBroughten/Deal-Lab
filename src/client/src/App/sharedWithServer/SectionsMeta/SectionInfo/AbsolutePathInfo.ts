import { z } from "zod";
import { zS } from "../../utils/zod";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { VarbProp, VarbPropNext } from "../baseSectionsDerived/baseVarbInfo";
import {
  ExpectedCount,
  GeneralMixedIdInfo,
  GeneralMixedInfo,
} from "../baseSectionsVarbs/NanoIdInfo";
import { SectionName } from "../SectionName";
import {
  PathNameOfSection,
  SectionNameOfPath,
  SectionPathName,
} from "../sectionPathContexts/sectionPathNames";

interface PathNameProp<PN extends SectionPathName> {
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

export interface AbsolutePathInfo<PN extends SectionPathName = SectionPathName>
  extends PathNameProp<PN>,
    SectionNameProp<SectionNameOfPath<PN>> {}

export interface SectionAbsoluteInfo<SN extends SectionName>
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
> extends SectionAbsoluteInfo<SN>,
    PathMixedProp<EC> {}

export interface PathVarbNames<PN extends SectionPathName>
  extends PathNameProp<PN>,
    VarbProp {}

export interface AbsolutePathVarbInfo<PN extends SectionPathName>
  extends AbsolutePathInfo<PN>,
    VarbPropNext<SectionNameOfPath<PN>> {}

export interface VarbAbsoluteInfo<SN extends SectionName = SectionName>
  extends SectionAbsoluteInfo<SN>,
    VarbProp {}

export interface VarbAbsoluteInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends VarbAbsoluteInfo<SN>,
    PathMixedProp<EC> {}

export interface PathDbIdInfo<SN extends SectionName>
  extends SectionAbsoluteInfo<SN> {
  dbId: string;
}

export interface PathDbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends SectionAbsoluteInfo<SN>,
    GeneralMixedIdInfo<EC>,
    PathInfoTypeProp {
  infoType: "absolutePathDbId";
}

export interface PathDbVarbInfo<SN extends SectionName>
  extends VarbAbsoluteInfo<SN> {
  dbId: string;
}

export interface PathDbVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends VarbAbsoluteInfo<SN>,
    GeneralMixedIdInfo<EC> {
  infoType: "absolutePathDbId";
}
