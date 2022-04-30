import Analyzer from "../../Analyzer";
import { InEntityVarbInfo } from "../../SectionMetas/baseSections/baseValues/entities";
import { SectionFinder } from "../../SectionMetas/baseSectionTypes";
import { InfoS } from "../../SectionMetas/Info";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { StateValue } from "../StateSection/StateVarb/stateValue";
import { internal } from "./internal";

export function directUpdateAndSolve(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  value: StateValue
) {
  let next = this;
  next = internal.updateValueDirectly(next, feVarbInfo, value);
  return next.solveVarbs([feVarbInfo]);
}

export function updateSectionValuesAndSolve(
  this: Analyzer,
  finder: SectionFinder,
  values: { [varbName: string]: StateValue }
): Analyzer {
  const { feInfo } = this.section(finder);
  return Object.keys(values).reduce((next, varbName) => {
    const varbInfo = InfoS.feVarb(varbName, feInfo);
    return internal.updateValueDirectly(next, varbInfo, values[varbName]);
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
  next = internal.removeInEntity(next, feVarbInfo, { ...entityInfo, entityId });

  const nextEntityId = Analyzer.makeId();
  next = internal.addInEntity(next, feVarbInfo, {
    ...varbInfo,
    length: 0, // length and offset are arbitrary
    offset: 0, // just borrowing functionality from editor entities
    entityId: nextEntityId,
  });
  next = next.updateSectionValuesAndSolve(feVarbInfo, {
    ...varbInfo,
    entityId: nextEntityId,
  });
  return next.solveVarbs([feVarbInfo]);
}
