import { FeVarbInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../../Analyzer";
import { StateValue } from "../../StateSection/StateVarb/stateValue";
import { internal } from "../internal";

export function updateValue(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextValue: StateValue,
  wasUpdatedByEditor: boolean
): Analyzer {
  let next = analyzer;
  if (typeof nextValue === "object" && "entities" in nextValue)
    next = internal.updateConnectedEntities(
      next,
      feVarbInfo,
      nextValue.entities
    );

  const nextVarb = next
    .varb(feVarbInfo)
    .updateValue(nextValue, wasUpdatedByEditor);
  return next.updateVarb(nextVarb);
}

export function updateValueDirectly(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextValue: StateValue
) {
  // not to be used for editor updates.
  return internal.updateValue(analyzer, feVarbInfo, nextValue, false);
}
