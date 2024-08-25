import { AbsolutePathNode } from "../sectionPaths/sectionPathNames";
import { ChildName } from "../stateSchemas/derivedFromChildrenSchemas/ChildName";
import { SectionName } from "../stateSchemas/SectionName";
import { DbIdProp, NanoIdProp } from "./NanoIdInfo";
import { SectionNameProp } from "./SectionNameProp";
import { MixedInfoProps, VarbProp } from "./VarbInfoBase";

type AbsolutePathProp = {
  path: ChildName[];
};
type AbsolutePathNodeProp = {
  pathNodes: AbsolutePathNode[];
};

export interface AbsolutePathInfo<SN extends SectionName>
  extends SectionNameProp<SN>,
    AbsolutePathProp {}

export interface AbsolutePathDbInfo<SN extends SectionName>
  extends AbsolutePathInfo<SN> {
  dbId: string;
}

export interface AbsolutePathNodeInfoMixed<SN extends SectionName = SectionName>
  extends SectionNameProp<SN>,
    AbsolutePathNodeProp,
    MixedInfoProps<"absolutePathNode"> {}

export interface AbsolutePathNodeDbIdInfo<SN extends SectionName = SectionName>
  extends SectionNameProp<SN>,
    AbsolutePathNodeProp,
    MixedInfoProps<"absolutePathNodeDbId">,
    DbIdProp {}

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
