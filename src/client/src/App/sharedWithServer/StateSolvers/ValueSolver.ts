import assert from "assert";
import { NumberProps } from "../Analyzer/methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";
import calculations, {
  isCalculationName,
} from "../SectionsMeta/baseSections/baseValues/calculations";
import {
  DbNumObj,
  FailedVarbs,
  NumObj,
  NumObjCache,
  NumObjNumber,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../SectionsMeta/baseSections/baseValues/updateFnNames";
import { SpecificVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/GetterSection";
import { Str } from "../utils/Str";
import { FocalVarbBase } from "../VarbFocal/FocalVarbBase";
import { solveText } from "./ValueSolver/solveText";
import { UserVarbValueSolver } from "./ValueSolver/UserVarbValueSolver";

export class ValueSolver<
  SN extends SectionName<"hasVarb">
> extends FocalVarbBase<SN> {
  private updateFns = {
    string: (): string => {
      return this.selfVarb.value("string");
    },
    editorValue: (): NumObj => {
      assert(this.selfVarb.varbName === "editorValue");
      const value = this.selfVarb.value("numObj");
      const { cache } = this.selfVarb.localValue("editorValue", "numObj");
      return value.updateCache(cache);
    },
    loadedNumObj: (): NumObj => {
      const numObj = this.selfVarb.value("numObj");
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
    calcVarbs: (): NumObj => {
      const solvableText = this.solvableTextFromCalcVarbs();
      const number = this.solvableTextToNumber(solvableText);
      const numObj = this.selfVarb.value("numObj");
      const next = numObj.updateCache({
        solvableText,
        number,
      });
      return next;
    },
    calculation: (): NumObj => {
      const solvableText = this.solvableTextFromCalculation();
      const number = this.solvableTextToNumber(solvableText);
      const numObj = this.selfVarb.value("numObj");
      const nextNumObj = numObj.updateCache({
        solvableText,
        number,
      });
      return nextNumObj.updateCore({
        editorText: `${number === "?" ? "" : number}`,
        entities: [],
      });
    },
    userVarb: (): NumObj => {
      if (this.self.sectionName === "userVarbItem") {
        const userVarbSolver = new UserVarbValueSolver(
          this.constructorProps as GetterSectionProps<"userVarbItem">
        );

        return userVarbSolver.getUserVarbValue();
      } else throw new Error("section must contain at least one varb");
    },
    loadedString: (): string => {
      const { varbInfoValues } = this.self.varbs;
      if (this.sections.hasSectionMixed(varbInfoValues)) {
        return this.sections.displayNameByMixed(varbInfoValues);
      } else return "Variable not found.";
    },
  };

  solveValue(): NumObj | string {
    const { updateFnName } = this.selfVarb;
    if (isCalculationName(updateFnName)) return this.updateFns.calculation();
    if (this.isInUpdateFns(updateFnName)) return this.updateFns[updateFnName]();
    else throw new Error(`updateFnName ${updateFnName} not found.`);
  }
  private isInUpdateFns(str: string): str is keyof typeof this.updateFns {
    return str in this.updateFns;
  }
  private solvableTextFromCalcVarbs(): string {
    if (this.selfVarb.updateFnName !== "calcVarbs")
      throw new Error("This is only for calcVarbs");

    const { core } = this.selfVarb.value("numObj");
    return this.solvableTextFromEditorTextAndEntities(core);
  }
  private solvableTextFromEditorTextAndEntities({
    editorText,
    entities,
  }: DbNumObj): string {
    let solvableText = editorText;
    for (const entity of entities) {
      const num = this.getSolvableNumber(entity);
      solvableText = Str.replaceRange(
        solvableText,
        entity.offset,
        entity.offset + entity.length,
        `${num}`
      );
    }
    return solvableText;
  }
  private getSolvableNumber(feVarbInfo: SpecificVarbInfo): NumObjNumber {
    const varb = this.sections.varbByMixed(feVarbInfo);
    if (!varb) return "?";
    return varb.value("numObj").number;
  }
  private solvableTextToNumber(solvableText: string): NumObjNumber {
    const { updateFnName } = this.selfVarb;
    if (isNumObjUpdateFnName(updateFnName)) {
      const { unit } = this.selfVarb.varb.meta;
      return solveText(solvableText, unit, updateFnName);
    } else {
      throw new Error("For now, this is only for numObjs.");
    }
  }
  private solvableTextFromCalculation() {
    const { updateFnName } = this.selfVarb;
    if (!isCalculationName(updateFnName))
      throw new Error(
        `updateFnName is ${updateFnName}, but this is only for pure calculations`
      );

    const { numberVarbs } = this.getNumberVarbs();
    const solvableText = calculations[updateFnName](numberVarbs as any);
    return solvableText;
  }
  private getNumberVarbs(): {
    numberVarbs: NumberProps;
    failedVarbs: FailedVarbs;
  } {
    const numberVarbs: NumberProps = {};
    const failedVarbs: FailedVarbs = [];

    const { updateFnProps } = this.selfVarb;

    for (let [propName, propOrArr] of Object.entries(updateFnProps)) {
      if (Array.isArray(propOrArr)) numberVarbs[propName] = [];
      else propOrArr = [propOrArr];
      for (const relInfo of propOrArr) {
        const inVarbs = this.selfVarb.varbsByFocal(relInfo);
        for (const inVarb of inVarbs) {
          const value = inVarb.value();
          if (!(value instanceof NumObj)) continue;
          let { number: num } = inVarb.value("numObj");
          if (num === "?") {
            failedVarbs.push({
              errorMessage: "failed varb",
              ...relInfo,
            });
          }
          const numArr = numberVarbs[propName];
          if (Array.isArray(numArr)) numArr.push(num);
          else numberVarbs[propName] = num;
        }
      }
    }

    return { numberVarbs, failedVarbs };
  }
}
