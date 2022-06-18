import calculations, {
  isCalculationName,
  NumberProps,
} from "../SectionsMeta/baseSections/baseValues/calculations";
import {
  DbNumObj,
  FailedVarbs,
  NumObj,
  NumObjCache,
  NumObjNumber,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../SectionsMeta/baseSections/baseValues/updateFnNames";
import { InfoS } from "../SectionsMeta/Info";
import { SpecificVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { UpdateFnProps } from "../SectionsMeta/relSections/rel/relVarbTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbs } from "../StateGetters/GetterVarbs";
import { Str } from "../utils/Str";
import { solveText } from "./SolveValueVarb/solveText";
import { UserVarbValueSolver } from "./SolveValueVarb/UserVarbValueSolver";

export class SolveValueVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private getterSections = new GetterSections(this.getterSectionsProps);
  private getterList = new GetterList(this.getterListProps);
  private getterVarbs = new GetterVarbs(this.getterSectionProps);
  private getterVarb = new GetterVarb(this.getterVarbProps);
  private updateFns = {
    string: (): string => {
      return this.getterVarb.value("string");
    },

    editorValue: (): NumObj => {
      const value = this.getterVarb.value("numObj");
      const { cache } = this.getterVarb.localValue("editorValue", "numObj");
      return value.updateCache(cache);
    },
    loadedNumObj: (): NumObj => {
      const numObj = this.getterVarb.value("numObj");
      const loadingVarbInfo = this.getterVarbs.varbInfoStringValues;

      let nextCache: NumObjCache;
      if (
        InfoS.is.inEntityVarb(loadingVarbInfo) &&
        this.getterList.hasByMixed(loadingVarbInfo)
      ) {
        const varb = this.getterSections.varbByMixed(loadingVarbInfo);
        const loadedValue = varb.value("numObj");
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
      const numObj = this.getterVarb.value("numObj");
      const next = numObj.updateCache({
        solvableText,
        number,
      });
      return next;
    },
    calculation: (): NumObj => {
      const solvableText = this.solvableTextFromCalculation();
      const number = this.solvableTextToNumber(solvableText);
      const numObj = this.getterVarb.value("numObj");
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
      if (this.getterVarb.sectionName === "userVarbItem") {
        const userVarbSolver = new UserVarbValueSolver(
          this.getterSectionProps as GetterSectionProps<"userVarbItem">
        );

        return userVarbSolver.getUserVarbValue();
      } else throw new Error("section must contain at least one varb");
    },
    loadedString: (): string => {
      const { varbInfoValues } = this.getterVarbs;
      if (this.getterSections.hasSectionMixed(varbInfoValues)) {
        const varb = this.getterSections.varbByMixed(varbInfoValues);
        return varb.displayName;
      } else return "Variable not found.";
    },
  };

  solveValue(): NumObj | string {
    const { updateFnName } = this.getterVarb;
    if (isCalculationName(updateFnName)) return this.updateFns.calculation();
    if (this.isInUpdateFns(updateFnName)) return this.updateFns[updateFnName]();
    else throw new Error(`updateFnName ${updateFnName} not found.`);
  }
  private isInUpdateFns(str: string): str is keyof typeof this.updateFns {
    return str in this.updateFns;
  }
  private solvableTextFromCalcVarbs(): string {
    if (this.getterVarb.updateFnName !== "calcVarbs")
      throw new Error("This is only for calcVarbs");

    const { core } = this.getterVarb.value("numObj");
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
    const varb = this.getterSections.varbByMixed(feVarbInfo);
    if (!varb) return "?";
    return varb.value("numObj").number;
  }
  private solvableTextToNumber(solvableText: string): NumObjNumber {
    const { updateFnName } = this.getterVarb;
    if (isNumObjUpdateFnName(updateFnName)) {
      const { unit } = this.getterVarb.meta;
      return solveText(solvableText, unit, updateFnName);
    } else {
      throw new Error("For now, this is only for numObjs.");
    }
  }
  private solvableTextFromCalculation() {
    const { updateFnName } = this.getterVarb;
    if (!isCalculationName(updateFnName))
      throw new Error(
        `updateFnName is ${updateFnName}, but this is only for pure calculations`
      );

    const { updateFnProps } = this.getterVarb;
    const { numberVarbs } = this.getNumberVarbs(updateFnProps);
    const solvableText = calculations[updateFnName](numberVarbs as any);
    return solvableText;
  }
  private getNumberVarbs(updateFnProps: UpdateFnProps): {
    numberVarbs: NumberProps;
    failedVarbs: FailedVarbs;
  } {
    const numberVarbs: NumberProps = {};
    const failedVarbs: FailedVarbs = [];

    for (let [propName, propOrArr] of Object.entries(updateFnProps)) {
      if (Array.isArray(propOrArr)) numberVarbs[propName] = [];
      else propOrArr = [propOrArr];
      for (const relInfo of propOrArr) {
        const inVarbs = this.getterVarbs.varbsByFocalMixed(relInfo);
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
