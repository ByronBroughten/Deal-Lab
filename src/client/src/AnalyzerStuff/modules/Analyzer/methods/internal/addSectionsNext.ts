import {
  FeInfo,
  InfoS,
} from "../../../../../App/sharedWithServer/SectionsMeta/Info";
import { FeVarbInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../../Analyzer";
import { internal } from "../internal";
import { AddSectionProps } from "./addSections/addSectionsTypes";
import { initOneSectionNext } from "./addSectionsNext/initOneSectionNext";

export function addSectionsNext(
  next: Analyzer,
  parentFirstPropsList: AddSectionProps[]
) {
  const newFeInfos: FeInfo[] = [];
  for (const props of parentFirstPropsList) {
    next = initOneSectionNext(next, props);
    const newFeInfo = next.lastSection(props.sectionName).feInfo;
    newFeInfos.push(newFeInfo);
  }

  return finalizeNewSections(next, newFeInfos);
}

function finalizeNewSections(next: Analyzer, newFeInfos: FeInfo[]) {
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
