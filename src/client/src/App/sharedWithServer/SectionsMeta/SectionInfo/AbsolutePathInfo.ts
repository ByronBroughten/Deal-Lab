import { NanoIdProp } from "../allBaseSectionVarbs/NanoIdInfo";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { MixedInfoProps, VarbProp } from "../baseSectionsDerived/baseVarbInfo";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { SectionName } from "../SectionName";

type AbsolutePathProp = {
  path: ChildName[];
};

export interface AbsolutePathInfo<SN extends SectionName>
  extends SectionNameProp<SN>,
    AbsolutePathProp {}

export interface AbsolutePathDbInfo<SN extends SectionName>
  extends AbsolutePathInfo<SN> {
  dbId: string;
}

export interface AbsolutePathInfoMixed<SN extends SectionName = SectionName>
  extends AbsolutePathInfo<SN>,
    MixedInfoProps<"absolutePath"> {}

export interface AbsolutePathDbInfoMixed<SN extends SectionName = SectionName>
  extends AbsolutePathInfo<SN>,
    MixedInfoProps<"absolutePathDbId">,
    NanoIdProp {}

export interface AbsoluteVarbInfoMixed<SN extends SectionName>
  extends AbsolutePathInfoMixed<SN>,
    VarbProp {}

export interface AbsoluteDbVarbInfoMixed<SN extends SectionName>
  extends AbsoluteVarbInfoMixed<SN>,
    VarbProp {
  dbId: string;
}

export function absolutePathInfo<SN extends SectionName>(
  sectionName: SN,
  path: ChildName[]
): AbsolutePathInfo<SN> {
  return {
    sectionName,
    path,
  };
}
