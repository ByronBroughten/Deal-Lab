import calculations, {
  isCalculationName,
  NumberProps,
} from "../SectionsMeta/baseSections/baseValues/calculations";
import {
  FailedVarbs,
  NumObj,
  NumObjCache,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { InfoS } from "../SectionsMeta/Info";
import { UpdateFnProps } from "../SectionsMeta/relSections/rel/relVarbTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbs } from "../StateGetters/GetterVarbs";
import { SolveNumObjVarb } from "./SolveNumObjVarb";
import { UserVarbValueSolver } from "./SolveValueVarb/UserVarbValueSolver";

export class SolveValueVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  private get getterList() {
    return new GetterList(this.getterListProps);
  }
  private get getterVarbs() {
    return new GetterVarbs(this.getterSectionProps);
  }
  private get getterVarb() {
    return new GetterVarb(this.getterVarbProps);
  }

  private get numObjSolver() {
    return new SolveNumObjVarb(this.getterVarbProps);
  }
  private updateFns = {
    string: (): string => {
      return this.getterVarb.value("string");
    },

    editorValue: (): NumObj => {
      const value = this.getterVarb.value("numObj");
      const { cache } = this.getterVarb.localValue("editorValue", "numObj");
      return value.updateCore(cache);
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
          numString: "?",
        };
      }
      const nextNumObj = numObj.updateCore(nextCache);
      const nextEntities = numObj.entities.filter(
        (entity) => entity.length === 0
      );
      return nextNumObj.updateCore({
        editorText: `${nextCache.numString === "?" ? "" : nextCache.numString}`,
        entities: nextEntities,
      });
    },
    calcVarbs: (): NumObj => {
      const solvableText = this.solvableTextFromCalcVarbs();
      const numString = this.numObjSolver.solvableTextToNumString(solvableText);
      const numObj = this.getterVarb.value("numObj");
      const next = numObj.updateCore({
        solvableText,
        numString,
      });
      return next;
    },
    calculation: (): NumObj => {
      const solvableText = this.solvableTextFromCalculation();
      const numString = this.numObjSolver.solvableTextToNumString(solvableText);
      const numObj = this.getterVarb.value("numObj");
      const nextNumObj = numObj.updateCore({
        solvableText,
        numString,
      });
      return nextNumObj.updateCore({
        editorText: numString === "?" ? "" : numString,
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
    return this.numObjSolver.solvableTextFromTextAndEntities(core);
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
