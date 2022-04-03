import Analyzer from "../../../Analyzer";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../../SectionMetas/relNameArrs/ChildTypes";
import { ParentFinder } from "../../SectionMetas/relNameArrs/ParentTypes";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { DbSection, DbVarbs } from "../../DbEntry";
import { internal } from "../internal";
import {
  gatherSectionInitProps,
  GatherSectionInitPropsProps,
} from "./addSections/gatherSectionInitProps";
import {
  initOneSection,
  InitOneSectionProps,
} from "./addSections/initOneSection";
import { AddSectionProps } from "./addSections/addSectionsTypes";

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

// Ok, I don't need the analyzer to contain defaults
// anymore, because I want to move away from that being
// something that can be set.

// I do want the possibility of sections being set using the hard-coded sane
// defaults.

// At initialization, I will create an array of sectionProps
// and some of them will be derived from the default sections

export function nextAddSections(
  next: Analyzer,
  parentFirstPropsList: AddSectionProps[] | AddSectionProps
) {
  if (!Array.isArray(parentFirstPropsList))
    parentFirstPropsList = [parentFirstPropsList];
  for (const props of parentFirstPropsList) {
  }
}
