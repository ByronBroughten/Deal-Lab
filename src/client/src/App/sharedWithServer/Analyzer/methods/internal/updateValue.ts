import Analyzer from "../../../Analyzer";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
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
