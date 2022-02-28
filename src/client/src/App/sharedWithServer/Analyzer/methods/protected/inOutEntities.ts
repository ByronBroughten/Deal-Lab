import Analyzer from "../../../Analyzer";
import { OutEntity } from "../../StateSection/StateVarb/entities";
import {
  InEntity,
  InEntityVarbInfo,
} from "../../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";

export function addInEntity(
  this: Analyzer,
  feVarbInfo: OutEntity,
  inEntity: InEntity
): Analyzer {
  let next = this;
  const nextVarb = this.varb(feVarbInfo).addInEntity(inEntity);
  next = next.updateVarb(nextVarb);
  next = next.addOutEntity(inEntity, feVarbInfo);
  return next;
}

export function removeInEntity(
  this: Analyzer,
  feVarbInfo: OutEntity,
  { entityId, ...inEntityVarbInfo }: InEntityVarbInfo & { entityId: string }
): // the entityVarbInfo is required because the inEntity with that id might be gone
// for some reason, in which case you still should remove the outEntity from it
Analyzer {
  let next = this;
  const nextVarb = next.varb(feVarbInfo).removeInEntity(entityId);
  next = next.updateVarb(nextVarb);
  next = next.removeOutEntity(inEntityVarbInfo, feVarbInfo);
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
  this: Analyzer,
  varbInfo: InEntityVarbInfo,
  outEntity: OutEntity
): Analyzer {
  if (isUserVarbAndWasDeleted(this, varbInfo)) return this;
  const nextVarb = this.varb(varbInfo).addOutEntity(outEntity);
  return this.updateVarb(nextVarb);
}

export function removeOutEntity(
  this: Analyzer,
  varbInfo: InEntityVarbInfo,
  outEntity: OutEntity
): Analyzer {
  const varb = this.findVarb(varbInfo);
  if (!varb) return this;
  const nextVarb = varb.removeOutEntity(outEntity);
  return this.updateVarb(nextVarb);
}
