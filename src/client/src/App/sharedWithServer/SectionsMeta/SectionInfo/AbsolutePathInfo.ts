import {
  ExpectedCount,
  GeneralMixedIdInfo,
} from "../allBaseSectionVarbs/NanoIdInfo";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { VarbProp } from "../baseSectionsDerived/baseVarbInfo";
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

const absolutePathInfoTypes = ["absolutePath", "absolutePathDbId"] as const;
type AbsolutePathInfoType = typeof absolutePathInfoTypes[number];
type AbsolutePathInfoTypeProp = {
  infoType: AbsolutePathInfoType;
};
export function isAbsolutePathType(value: any): value is AbsolutePathInfoType {
  return absolutePathInfoTypes.includes(value);
}

export interface AbsolutePathInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends AbsolutePathInfo<SN>,
    GeneralMixedIdInfo<EC>,
    AbsolutePathInfoTypeProp {
  infoType: "absolutePath";
}

export interface AbsolutePathDbInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends AbsolutePathInfo<SN>,
    GeneralMixedIdInfo<EC>,
    AbsolutePathInfoTypeProp {
  infoType: "absolutePathDbId";
}

export interface AbsoluteVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends AbsolutePathInfoMixed<SN, EC>,
    VarbProp {}

export interface AbsoluteDbVarbInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends AbsoluteVarbInfoMixed<SN, EC>,
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
