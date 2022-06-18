import {
  InEntity,
  InEntityVarbInfo,
} from "../../../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { FeVarbInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../../Analyzer";
import { OutEntity } from "../../StateSection/StateVarb/entities";

export function addInEntity(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  inEntity: InEntity
): Analyzer {
  let next = analyzer;
  const nextVarb = next.varb(feVarbInfo).addInEntity(inEntity);
  next = next.updateVarb(nextVarb);

  const outEntity = {
    ...feVarbInfo,
    entityId: inEntity.entityId,
  } as const;

  next = addOutEntity(next, inEntity, outEntity);
  return next;
}
export function removeInEntity(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  { entityId, ...inEntityVarbInfo }: InEntityVarbInfo & { entityId: string }
): // the entityVarbInfo is required because the inEntity with that id might be gone
// for some reason, in which case you still should remove the outEntity from it
Analyzer {
  let next = analyzer;
  const nextVarb = next.varb(feVarbInfo).removeInEntity(entityId);
  next = next.updateVarb(nextVarb);
  next = removeOutEntity(next, inEntityVarbInfo, { ...feVarbInfo, entityId });
  // so it has an inEntity. the inEntity's id should match that of the outEntity

  return next;
}

function isUserVarbAndWasDeleted(
  analyzer: Analyzer,
  varbInfo: InEntityVarbInfo
): boolean {
  const { sectionName } = varbInfo;
  return sectionName === "userVarbItem" && !analyzer.hasSection(varbInfo);
}
export function addOutEntity(
  analyzer: Analyzer,
  varbInfo: InEntityVarbInfo,
  outEntity: OutEntity
): Analyzer {
  // I can guarantee that there are only one of certain dbIds
  if (isUserVarbAndWasDeleted(analyzer, varbInfo)) return analyzer;
  const nextVarb = analyzer.varb(varbInfo).addOutEntity(outEntity);
  return analyzer.updateVarb(nextVarb);
}
export function removeOutEntity(
  analyzer: Analyzer,
  varbInfo: InEntityVarbInfo,
  outEntity: OutEntity
): Analyzer {
  const varb = analyzer.findVarb(varbInfo);
  if (!varb) return analyzer;
  const nextVarb = varb.removeOutEntity(outEntity);
  return analyzer.updateVarb(nextVarb);
}
