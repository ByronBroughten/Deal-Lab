import Analyzer from "../../../Analyzer";
import { isCalculationName } from "../../../SectionMetas/baseSections/baseValues/calculations";
import { NumObj } from "../../../SectionMetas/baseSections/baseValues/NumObj";
import { Inf } from "../../../SectionMetas/Info";
import { FeVarbInfo } from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { internal } from "../internal";

export function solveValue(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo
): NumObj | string | undefined {
  const updateFns = {
    editorValue(): NumObj {
      const value = analyzer.value(feVarbInfo, "numObj");
      const { cache } = analyzer.feValue("editorValue", feVarbInfo, "numObj");
      return value.updateCache({
        ...cache,
      });
    },
    loadedNumObj(): NumObj {
      const numObj = analyzer.value(feVarbInfo, "numObj");
      const loadingVarbInfo = analyzer.varbInfoValues(feVarbInfo);
      const loadedValue = analyzer.findValue(loadingVarbInfo, "numObj");

      const nextCache = loadedValue
        ? loadedValue.cache
        : ({
            solvableText: "?",
            number: "?",
          } as const);

      const nextNumObj = numObj.updateCache(nextCache);
      const nextEntities = numObj.entities.filter(
        (entity) => entity.length === 0
      );
      return nextNumObj.updateCore({
        editorText: `${nextCache.number === "?" ? "" : nextCache.number}`,
        entities: nextEntities,
      });
    },
    calcVarbs(): NumObj {
      // this is where it's happening, ya?
      const solvableText = analyzer.solvableTextFromCalcVarbs(feVarbInfo);
      const number = analyzer.solvableTextToNumber(feVarbInfo, solvableText);
      const numObj = analyzer.value(feVarbInfo, "numObj");
      // what is happening to the entities?
      const next = numObj.updateCache({
        solvableText,
        number,
      });
      return next;
    },
    calculation(): NumObj {
      const solvableText = analyzer.solvableTextFromCalculation(feVarbInfo);
      const number = analyzer.solvableTextToNumber(feVarbInfo, solvableText);
      const numObj = analyzer.value(feVarbInfo, "numObj");
      const nextNumObj = numObj.updateCache({
        solvableText,
        number,
      });
      // I should get rid of entities, right?
      // I can't just get rid of them, though, right?

      return nextNumObj.updateCore({
        editorText: `${number === "?" ? "" : number}`,
        entities: [],
      });
    },
    userVarb(): NumObj {
      if (Inf.is.feName(feVarbInfo, "userVarbItem"))
        return analyzer.getUserVarbValue(feVarbInfo);
      else throw new Error("section must contain at least one varb");
    },
    loadedString(): string {
      const varbInfo = analyzer.varbInfoValues(feVarbInfo);
      const varb = analyzer.findVarb(varbInfo);
      if (!varb) return "Variable not found.";
      else return analyzer.displayName(feVarbInfo);
    },
  };
  function isInUpdateFns(str: string): str is keyof typeof updateFns {
    return str in updateFns;
  }

  const updateFnName = analyzer.updateFnName(feVarbInfo);
  if (isCalculationName(updateFnName)) return updateFns.calculation();
  if (isInUpdateFns(updateFnName)) return updateFns[updateFnName]();
  else return undefined;
}

export function solveAndUpdateValue(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo
): Analyzer {
  const newValue = solveValue(analyzer, feVarbInfo);
  if (newValue !== undefined)
    return internal.updateValueDirectly(analyzer, feVarbInfo, newValue);
  else return analyzer;
}
