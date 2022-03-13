import Analyzer from "../../Analyzer";
import { Inf } from "../SectionMetas/Info";
import { FeVarbInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { InEntityVarbInfo } from "../SectionMetas/relSections/rel/valueMeta/NumObj/entities";
import { StateValue } from "../StateSection/StateVarb/stateValue";
import { internal } from "./internal";

export function updateValueDirectly(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextValue: StateValue
) {
  // not to be used for editor updates.
  return internal.updateValue(this, feVarbInfo, nextValue, false);
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
  next = internal.removeInEntity(next, feVarbInfo, { entityId, ...entityInfo });

  const nextEntityId = Analyzer.makeId();
  next = internal.addInEntity(next, feVarbInfo, {
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
