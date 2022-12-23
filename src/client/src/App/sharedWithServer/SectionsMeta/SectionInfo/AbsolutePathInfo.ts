import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { VarbProp } from "../baseSectionsDerived/baseVarbInfo";
import {
  ExpectedCount,
  GeneralMixedIdInfo,
} from "../baseSectionsVarbs/NanoIdInfo";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { SectionName } from "../SectionName";

type AbsolutePathProp<PT extends ChildName[]> = {
  path: PT;
};

export interface AbsolutePathInfo<
  SN extends SectionName,
  PT extends ChildName[] = ChildName[]
> extends SectionNameProp<SN>,
    AbsolutePathProp<PT> {}

export interface AbsolutePathDbInfo<
  SN extends SectionName,
  PT extends ChildName[] = ChildName[]
> extends AbsolutePathInfo<SN, PT> {
  dbId: string;
}

const absolutePathInfoTypes = ["absolutePath", "absolutePathDbId"] as const;
type AbsolutePathInfoType = typeof absolutePathInfoTypes[number];
type AbsolutePathInfoTypeProp = {
  infoType: AbsolutePathInfoType;
};

export interface AbsolutePathInfoMixed<
  SN extends SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends AbsolutePathInfo<SN>,
    GeneralMixedIdInfo<EC>,
    AbsolutePathInfoTypeProp {
  infoType: "absolutePath";
}

export interface AbsolutePathDbIdInfoMixed<
  SN extends SectionName,
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
  PT extends ChildName[]
>(sectionName: SN, path: PT): AbsolutePathInfo<SN, PT> {
  return {
    sectionName,
    path,
  };
}
