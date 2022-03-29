import Analyzer from "../../../Analyzer";
import { DbSection } from "../../DbEntry";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import { SectionName } from "../../SectionMetas/SectionName";
import {
  gatherSectionInitProps,
  GatherSectionInitPropsProps,
} from "./addSections/gatherSectionInitProps";
import {
  initOneSection,
  InitOneSectionProps,
} from "./addSections/initOneSection";
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
      const outEntity = { ...feInfo, varbName, entityId: inEntity.entityId };
      next = internal.addOutEntity(next, inEntity, outEntity);
    }
  }
  return next;
}

// Two choices:
// 1. Let more protected methods onto the class
// 2. Let fewer protected methods onto the class and use
// more imports.

function initOutEntities(next: Analyzer, newFeInfos: FeInfo[]) {
  for (const feInfo of newFeInfos) {
    next = addOutEntitiesForSectionInVarbs(next, feInfo);
  }
  return next;
}

function feInfosFromInitPropsArr(
  initPropsArr: InitOneSectionProps[]
): FeInfo[] {
  return initPropsArr.map((initProps) => {
    const { feId, sectionName } = initProps;
    return Inf.fe(sectionName, feId);
  });
}

export type InitSectionAndChildrenProps<S extends SectionName = SectionName> =
  Omit<GatherSectionInitPropsProps<S>, "propArr">;
function initSectionAndChildren<S extends SectionName>(
  analyzer: Analyzer,
  props: InitSectionAndChildrenProps<S>
): Analyzer {
  let next = analyzer;

  const initPropsArr = gatherSectionInitProps(next, props);
  const newFeInfos: FeInfo[] = [];
  for (const initProps of initPropsArr) {
    next = initOneSection(next, initProps);
    const { feId, sectionName } = initProps;
    newFeInfos.push(Inf.fe(sectionName, feId));
  }

  next = initOutEntities(next, newFeInfos);

  const varbInfosToSolveFor: FeVarbInfo[] = next.nestedFeVarbInfos(newFeInfos);
  return next.addVarbsToSolveFor(...varbInfosToSolveFor);
}

export function addSections(
  analyzer: Analyzer,
  propArr: InitSectionAndChildrenProps[] | InitSectionAndChildrenProps
): Analyzer {
  if (!Array.isArray(propArr)) propArr = [propArr];
  let next = analyzer;
  for (const props of propArr) {
    next = initSectionAndChildren(next, props);
  }
  return next;
}
