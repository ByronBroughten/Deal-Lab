import {
  DbVarbInfo,
  RelVarbInfo,
} from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import calculations, {
  isCalculationName,
  NumberProps,
} from "../SectionsMeta/baseSectionsUtils/baseValues/calculations";
import { NumObj } from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { InfoS } from "../SectionsMeta/Info";
import { UpdateFnProps } from "../SectionsMeta/relSectionsUtils/rel/relVarbTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbNumObj } from "../StateGetters/GetterVarbNumObj";
import { GetterVarbs } from "../StateGetters/GetterVarbs";
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
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  private updateFns = {
    string: (): string => {
      return this.getterVarb.value("string");
    },
    editorValue: (): NumObj => {
      const value = this.getterVarb.value("numObj");
      const { solvableText } = this.getterVarb.localValue(
        "editorValue",
        "numObj"
      );
      return { ...value, solvableText };
    },
    loadedNumObj: (): NumObj => {
      const current = this.getterVarb.value("numObj");
      const nextTexts = this.loadNextTexts();
      return {
        ...nextTexts,
        entities: current.entities.filter((entity) => entity.length === 0),
      };
    },
    calcVarbs: (): NumObj => {
      const current = this.getterVarb.value("numObj");
      return {
        ...current,
        solvableText: this.solvableTextFromCalcVarbs(),
      };
    },
    calculation: (): NumObj => {
      const solvableText = this.solvableTextFromCalculation();
      const numString = this.numObjSolver.solveTextToNumString(solvableText);
      return {
        solvableText,
        editorText: numString === "?" ? "" : numString,
        entities: [],
      };
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
  private loadNextTexts(): { editorText: string; solvableText: string } {
    const loadingVarbInfo = this.getterVarbs.varbInfoStringValues;
    if (
      InfoS.is.inEntityVarb(loadingVarbInfo) &&
      this.getterList.hasByMixed(loadingVarbInfo)
    ) {
      const varb = this.getterSections.varbByMixed(loadingVarbInfo);
      return {
        solvableText: varb.value("numObj").solvableText,
        editorText:
          varb.numberOrQuestionMark === "?" ? "" : `${varb.numberValue}`,
      };
    } else {
      return {
        solvableText: "?",
        editorText: "",
      };
    }
  }
  private isInUpdateFns(str: string): str is keyof typeof this.updateFns {
    return str in this.updateFns;
  }
  private solvableTextFromCalcVarbs(): string {
    if (this.getterVarb.updateFnName !== "calcVarbs")
      throw new Error("This is only for calcVarbs");
    const numObj = this.getterVarb.value("numObj");
    return this.numObjSolver.solvableTextFromTextAndEntities(numObj);
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
          if (inVarb.hasValueType("numObj")) {
            const num = inVarb.numberOrQuestionMark;
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
    }
    return { numberVarbs, failedVarbs };
  }
}

export type FailedVarbs = FailedVarb[];
type FailedVarb = { errorMessage: string } & UpdateVarbInfo;
type UpdateVarbInfo = RelVarbInfo | DbVarbInfo;
