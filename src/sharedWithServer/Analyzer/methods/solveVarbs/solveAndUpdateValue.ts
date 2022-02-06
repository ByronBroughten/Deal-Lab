import Analyzer from "../../../Analyzer";
import { FeVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { StateValue } from "../../StateSection/StateVarb/stateValue";
import { NumObj } from "../../SectionMetas/relSections/rel/relValue/numObj";
import { isCalcNumObjFnName } from "../../SectionMetas/relSections/rel/relValue/numObj/updateFnNames";
import { Inf } from "../../SectionMetas/Info";

const updateFns = {
  editorValue(analyzer: Analyzer, feVarbInfo: FeVarbInfo): NumObj {
    const value = analyzer.value(feVarbInfo, "numObj");
    const { solvableText } = analyzer.feValue(
      "editorValue",
      feVarbInfo,
      "numObj"
    );
    return value.updateCore({
      solvableText,
    });
  },
  loadedNumObj(analyzer: Analyzer, feVarbInfo: FeVarbInfo): NumObj {
    const value = analyzer.value(feVarbInfo, "numObj");
    const loadingVarbInfo = analyzer.varbInfoValues(feVarbInfo);
    const loadedValue = analyzer.findValue(loadingVarbInfo, "numObj");

    if (!loadedValue)
      return value.updateCore({
        solvableText: "?",
      });
    else
      return value.updateCore({
        solvableText: loadedValue.solvableText,
      });
  },
  loadedString(analyzer: Analyzer, feVarbInfo: FeVarbInfo): string {
    const varbInfo = analyzer.varbInfoValues(feVarbInfo);
    const varb = analyzer.findVarb(varbInfo);
    if (!varb) return "Variable not found.";
    else return analyzer.displayName(feVarbInfo);
  },
} as const;
type UpdateFnName = keyof typeof updateFns;
function isInUpdateFns(str: string): str is UpdateFnName {
  return str in updateFns;
}

export function solveValue(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): StateValue | undefined {
  const updateFnName = this.updateFnName(feVarbInfo);
  // ah, so it gets simple divide, but then it accesses
  // the default updateProps
  if (isCalcNumObjFnName(updateFnName))
    return this.updateNumObjCalc(feVarbInfo, updateFnName);
  else if (isInUpdateFns(updateFnName))
    return updateFns[updateFnName](this, feVarbInfo);
  else if (
    updateFnName === "userVarb" &&
    Inf.is.feName(feVarbInfo, "userVarbItem")
  )
    return this.getUserVarbValue(feVarbInfo);
  else return undefined;
}
export function solveAndUpdateValue(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): Analyzer {
  const newValue = this.solveValue(feVarbInfo);
  if (newValue) return this.updateValueDirectly(feVarbInfo, newValue);
  else return this;
}
