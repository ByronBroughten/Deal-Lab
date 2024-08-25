import { z } from "zod";
import {
  PathNameOfSection,
  SectionPathName,
  SectionPathVarbName,
} from "../../sectionPaths/sectionPathNames";
import { SectionName } from "../../stateSchemas/SectionName";
import { zS } from "../../utils/zod";
import { NanoIdProp } from "./NanoIdInfo";
import { MakeVarbProp, MixedInfoProps } from "./VarbInfoBase";

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
type PathNameInfoType = (typeof pathNameInfoTypes)[number];
type PathNameInfoTypeProp = {
  infoType: PathNameInfoType;
};

export function isPathInfoType(value: any): value is PathNameInfoType {
  return pathNameInfoTypes.includes(value);
}

interface PathNameInfo<PN extends SectionPathName = SectionPathName>
  extends PathNameProp<PN> {}
interface PathNameDbInfo<PN extends SectionPathName> extends PathNameInfo<PN> {
  dbId: string;
}
interface PathNameVarbInfo<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameInfo<PN>,
    MakeVarbProp<VN> {}

export interface PathNameInfoMixed<PN extends SectionPathName = SectionPathName>
  extends MixedInfoProps<"pathName"> {
  pathName: PN;
}

export interface PathVarbNames<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameProp<PN>,
    MakeVarbProp<VN> {}

export interface PathNameVarbInfoMixed<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameInfoMixed<PN>,
    MakeVarbProp<VN> {}

export interface PathNameDbInfoMixed<
  PN extends SectionPathName = SectionPathName
> extends PathNameProp<PN>,
    MixedInfoProps<"pathNameDbId">,
    NanoIdProp {}

export interface PathDbVarbInfoMixed<
  PN extends SectionPathName = SectionPathName,
  VN extends SectionPathVarbName<PN> = SectionPathVarbName<PN>
> extends PathNameVarbInfo<PN, VN>,
    MixedInfoProps<"pathNameDbId">,
    NanoIdProp {}
