import Analyzer from "../../Analyzer";
import { OutEntity } from "../StateSection/StateVarb/entities";
import {
  InEntity,
  InEntityVarbInfo,
} from "../SectionMetas/relSections/rel/relValue/numObj/entities";

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
): Analyzer {
  let next = this;
  const nextVarb = next.varb(feVarbInfo).removeInEntity(entityId);
  next = next.updateVarb(nextVarb);
  next = next.removeOutEntity(inEntityVarbInfo, feVarbInfo);
  return next;
}
export function addOutEntity(
  this: Analyzer,
  varbInfo: InEntityVarbInfo,
  outEntity: OutEntity
): Analyzer {
  if (this.isUserVarbAndWasDeleted(varbInfo)) return this;
  const nextVarb = this.varb(varbInfo).addOutEntity(outEntity);
  return this.updateVarb(nextVarb);
}
export function isUserVarbAndWasDeleted(
  this: Analyzer,
  varbInfo: InEntityVarbInfo
): boolean {
  const { sectionName } = varbInfo;
  return sectionName === "userVarbItem" && !this.hasSection(varbInfo);
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
