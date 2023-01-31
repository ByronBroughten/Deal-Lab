import { z } from "zod";
import { zS } from "../../utils/zod";
import { NanoIdProp } from "../allBaseSectionVarbs/NanoIdInfo";
import {
  MakeVarbProp,
  MixedInfoProps,
} from "../baseSectionsDerived/baseVarbInfo";
import { SectionName } from "../SectionName";
import {
  PathNameOfSection,
  SectionPathName,
  SectionPathVarbName,
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

interface PathNameInfoNext<PN extends SectionPathName = SectionPathName>
  extends PathNameProp<PN> {}
interface PathNameDbInfoNext<PN extends SectionPathName>
  extends PathNameInfoNext<PN> {
  dbId: string;
}
interface PathNameVarbInfoNext<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameInfoNext<PN>,
    MakeVarbProp<VN> {}

export interface PathNameInfoMixedNext<
  PN extends SectionPathName = SectionPathName
> extends MixedInfoProps<"pathName"> {
  pathName: PN;
}

export interface PathVarbNamesNext<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameProp<PN>,
    MakeVarbProp<VN> {}

export interface PathNameVarbInfoMixed<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameInfoMixedNext<PN>,
    MakeVarbProp<VN> {}

export interface PathNameDbInfoMixed<
  PN extends SectionPathName = SectionPathName
> extends PathNameProp<PN>,
    MixedInfoProps<"pathNameDbId">,
    NanoIdProp {}

export interface PathDbVarbInfoMixed<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameVarbInfoNext<PN, VN>,
    MixedInfoProps<"pathNameDbId">,
    NanoIdProp {}
