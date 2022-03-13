import Analyzer from "../../../Analyzer";
import { DbSection } from "../../DbEntry";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import { SectionName } from "../../SectionMetas/SectionName";
import {
  gatherSectionInitProps,
  GatherSectionInitPropsProps,
} from "./addSections/gatherSectionInitProps";
import { initOneSection } from "./addSections/initOneSection";
import { internal } from "../internal";

export type DbSectionInit = Omit<DbSection, "childDbIds">;
function addOutEntitiesForSectionInVarbs(
  analyzer: Analyzer,
  feInfo: FeInfo
): Analyzer {
  if (!Inf.is.fe(feInfo, "hasVarb")) return analyzer;
  let next = analyzer;
  const { varbs } = next.section(feInfo);
  for (const [varbName, varb] of Object.entries(varbs)) {
    for (const inEntity of varb.inEntities) {
      const outEntity = { ...feInfo, varbName };
      next = internal.addOutEntity(next, inEntity, outEntity);
    }
  }
  return next;
}

// Two choices:
// 1. Let more protected methods onto the class
// 2. Let fewer protected methods onto the class and use
// more imports.

export type InitSectionAndChildrenProps<S extends SectionName = SectionName> =
  Omit<GatherSectionInitPropsProps<S>, "propArr">;
function initSectionAndChildren<S extends SectionName>(
  analyzer: Analyzer,
  props: InitSectionAndChildrenProps<S>
): readonly [Analyzer, FeInfo[]] {
  let next = analyzer;
  const initPropsArr = gatherSectionInitProps(next, props);

  for (const initProps of initPropsArr) {
    next = initOneSection(next, initProps);
  }

  const newFeInfos = initPropsArr.map((initProps) => {
    const { feId, sectionName } = initProps;
    return Inf.fe(sectionName, feId);
  });
  return [next, newFeInfos];
}

export function addSections(
  analyzer: Analyzer,
  propArr: InitSectionAndChildrenProps[] | InitSectionAndChildrenProps
): [Analyzer, FeVarbInfo[]] {
  if (!Array.isArray(propArr)) propArr = [propArr];

  // I have to get infos for all the sections that are added
  let next = analyzer;
  const allNewFeInfos: FeInfo[] = [];
  let newFeInfos: FeInfo[] = [];

  for (const props of propArr) {
    [next, newFeInfos] = initSectionAndChildren(next, props);
    allNewFeInfos.push(...newFeInfos);
  }

  for (const feInfo of allNewFeInfos) {
    next = addOutEntitiesForSectionInVarbs(next, feInfo);
  }

  const varbInfosToSolveFor = next.nestedFeVarbInfos(allNewFeInfos);
  return [next, varbInfosToSolveFor];
}
