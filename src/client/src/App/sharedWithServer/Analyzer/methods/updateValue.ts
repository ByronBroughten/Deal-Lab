import {
  FeVarbInfo,
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../Analyzer";
import { StateValueAnyKey, ValueTypesPlusAny } from "../StateSection/StateVarb";
import { StateValue } from "../StateSection/StateVarb/stateValue";
import { InEntityVarbInfo } from "../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";
import { Inf } from "../SectionMetas/Info";
import { NumObj } from "../SectionMetas/relSections/baseSections/baseValues/NumObj";

export function updateValueDirectly(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextValue: StateValue
) {
  // not to be used for editor updates.
  return this.updateValue(feVarbInfo, nextValue, false);
}

export function updateValue(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextValue: StateValue,
  wasUpdatedByEditor: boolean
): Analyzer {
  let next = this;
  if (typeof nextValue === "object" && "entities" in nextValue)
    next = next.updateConnectedEntities(feVarbInfo, nextValue.entities);

  const nextVarb = this.varb(feVarbInfo).updateValue(
    nextValue,
    wasUpdatedByEditor
  );
  return this.updateVarb(nextVarb);
}

export function updateSectionValues(
  this: Analyzer,
  info: FeVarbInfo,
  values: { [varbName: string]: StateValue }
): Analyzer {
  return Object.keys(values).reduce((next, varbName) => {
    const varbInfo = Inf.feVarb(varbName, info);
    return next.updateValueDirectly(varbInfo, values[varbName]);
  }, this);
}
export function loadValueFromVarb(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  varbInfo: InEntityVarbInfo
): Analyzer {
  let next = this;
  const entityId = next.feValue("entityId", feVarbInfo, "string");
  const entityInfo = next.varbInfoValues(feVarbInfo);
  next = next.removeInEntity(feVarbInfo, { entityId, ...entityInfo });

  const nextEntityId = Analyzer.makeId();
  next = next.addInEntity(feVarbInfo, {
    ...varbInfo,
    length: 0, // length and offset are arbitrary
    offset: 0, // just borrowing functionality from editor entities
    entityId: nextEntityId,
  });
  next = next.updateSectionValues(feVarbInfo, {
    ...varbInfo,
    entityId: nextEntityId,
  });
  return next.solveVarbs([feVarbInfo]);
}
