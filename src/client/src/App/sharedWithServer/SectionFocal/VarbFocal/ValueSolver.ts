import assert from "assert";
import { NumObj } from "../../SectionsMeta/baseSections/baseValues/NumObj";

class ValueSolver {
  updateFns = {
    editorValue: (): NumObj => {
      assert(this.varbName === "editorValue");
      const value = this.value("numObj");
      const { cache } = this.localValue("editorValue", "numObj");
      return value.updateCache({
        ...cache,
      });
    },
    loadedNumObj: (): NumObj => {
      const numObj = this.value("numObj");
      const loadingVarbInfo = this.self.varbs.varbInfoValues;

      let nextCache: NumObjCache;
      if (this.sections.hasSectionMixed(loadingVarbInfo)) {
        const loadedValue = this.sections
          .varbByMixed(loadingVarbInfo)
          .value("numObj");
        nextCache = loadedValue.cache;
      } else {
        nextCache = {
          solvableText: "?",
          number: "?",
        };
      }
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
      if (InfoS.is.feName(feVarbInfo, "userVarbItem"))
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
}
