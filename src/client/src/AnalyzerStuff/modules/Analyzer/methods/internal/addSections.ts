import {
  FeInfo,
  InfoS,
} from "../../../../../App/sharedWithServer/SectionsMeta/Info";
import { FeVarbInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../../../../App/sharedWithServer/SectionsMeta/SectionName";
import Analyzer from "../../../Analyzer";
import { internal } from "../internal";
import {
  gatherSectionInitProps,
  GatherSectionInitPropsProps,
} from "./addSections/gatherSectionInitProps";
import {
  initOneSection,
  InitOneSectionProps,
} from "./addSections/initOneSection";

// here they init outEntities right in the thick of it.

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

export type InitSectionAndChildrenProps<S extends SectionName = SectionName> =
  Omit<GatherSectionInitPropsProps<S>, "propArr">;
function initSectionAndChildren<S extends SectionName>(
  next: Analyzer,
  props: InitSectionAndChildrenProps<S>
): Analyzer {
  const initPropsArr = gatherSectionInitProps(next, props);
  const newFeInfos: FeInfo[] = [];
  for (const initProps of initPropsArr) {
    next = initOneSection(next, initProps);
    const { feId, sectionName } = initProps;
    newFeInfos.push(InfoS.fe(sectionName, feId));
  }

  next = initOutEntities(next, newFeInfos);

  const varbInfosToSolveFor: FeVarbInfo[] = next.nestedFeVarbInfos(newFeInfos);
  return next.addVarbsToSolveFor(...varbInfosToSolveFor);
}

function initOutEntities(next: Analyzer, newFeInfos: FeInfo[]) {
  for (const feInfo of newFeInfos) {
    next = addOutEntitiesForSectionInVarbs(next, feInfo);
  }
  return next;
}

function addOutEntitiesForSectionInVarbs(
  analyzer: Analyzer,
  feInfo: FeInfo
): Analyzer {
  if (!InfoS.is.fe(feInfo, "hasVarb")) return analyzer;
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

function feInfosFromInitPropsArr(
  initPropsArr: InitOneSectionProps[]
): FeInfo[] {
  return initPropsArr.map((initProps) => {
    const { feId, sectionName } = initProps;
    return InfoS.fe(sectionName, feId);
  });
}
