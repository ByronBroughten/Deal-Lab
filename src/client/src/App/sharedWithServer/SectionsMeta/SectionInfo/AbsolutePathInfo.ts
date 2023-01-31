import { NanoIdProp } from "../allBaseSectionVarbs/NanoIdInfo";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { MixedInfoProps, VarbProp } from "../baseSectionsDerived/baseVarbInfo";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { DescendantName } from "../sectionChildrenDerived/DescendantSectionName";
import { SectionName } from "../SectionName";

type AbsolutePathProp<PT extends ChildName[]> = {
  path: PT;
};

export interface AbsolutePathInfo<
  SN extends SectionName,
  PT extends DescendantName<"root">[] = DescendantName<"root">[]
> extends SectionNameProp<SN>,
    AbsolutePathProp<PT> {}

export interface AbsolutePathDbInfo<
  SN extends SectionName,
  PT extends DescendantName<"root">[] = DescendantName<"root">[]
> extends AbsolutePathInfo<SN, PT> {
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

export function absolutePathInfo<
  SN extends SectionName,
  PT extends DescendantName<"root">[]
>(sectionName: SN, path: PT): AbsolutePathInfo<SN, PT> {
  return {
    sectionName,
    path,
  };
}

export function rootAbsolutePathInfo<
  SN extends SectionName,
  PT extends ChildName
>(sectionName: SN, path: PT[]): AbsolutePathInfo<SN> {
  return {
    sectionName,
    path: path as any,
  };
}
