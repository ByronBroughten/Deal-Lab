import Analyzer from "../../../Analyzer";
import { FeInfo, Inf } from "../../../SectionMetas/Info";
import { FeVarbInfo } from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { internal } from "../internal";
import { AddSectionProps } from "./addSections/addSectionsTypes";
import { initOneSectionNext } from "./addSectionsNext/initOneSectionNext";

export function addSectionsNext(
  next: Analyzer,
  parentFirstPropsList: AddSectionProps[]
) {
  const newFeInfos: FeInfo[] = [];
  for (const props of parentFirstPropsList as AddSectionProps[]) {
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
