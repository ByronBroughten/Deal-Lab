import { makeDefaultDealDisplayName } from "../defaultMaker/makeDefaultDeal";
import { VirtualVarbName } from "../SectionsMeta/baseSectionsDerived/baseVarbNames";
import { PathInVarbInfo } from "../SectionsMeta/sectionChildrenDerived/RelInOutVarbInfo";
import { RelVarbInfo } from "../SectionsMeta/SectionInfo/RelVarbInfo";
import { DbVarbInfoMixed } from "../SectionsMeta/SectionInfo/VarbInfoBase";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  CompletionStatusProps,
  UpdateFnProp,
  UpdateFnProps,
} from "../SectionsMeta/updateSectionVarbs/updateVarb/UpdateFnProps";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { InEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import {
  notApplicableString,
  numObj,
  NumObj,
} from "../SectionsMeta/values/StateValue/NumObj";
import {
  stringObj,
  StringObj,
} from "../SectionsMeta/values/StateValue/StringObj";
import { UnionValue } from "../SectionsMeta/values/StateValue/unionValues";
import calculations, {
  isCalculationName,
  NumberProps,
} from "../SectionsMeta/values/StateValue/valuesShared/calculations";
import { ValueInEntity } from "../SectionsMeta/values/StateValue/valuesShared/entities";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbNumObj } from "../StateGetters/GetterVarbNumObj";
import { InEntityGetterVarb } from "../StateGetters/InEntityGetterVarb";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { ConditionalValueSolver } from "./ValueUpdaterVarb/ConditionalValueSolver";
import { UserVarbValueSolver } from "./ValueUpdaterVarb/UserVarbValueSolver";

function calculatedNumObj(solvableText: string): NumObj {
  return {
    solvableText,
    mainText: "",
    entities: [],
    // for calculations to load correctly, there must be no entities
  };
}

export class SolveValueVarb<
  SN extends SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  get getterSection(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  private get getterVarb() {
    return new GetterVarb(this.getterVarbProps);
  }
  private get inEntityVarb() {
    return new InEntityGetterVarb(this.getterVarbProps);
  }
  private get numObjSolver() {
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  updatePropIsActive(
    focalSection: GetterSection,
    { andSwitches }: UpdateFnProp
  ): boolean {
    return andSwitches.every(({ switchInfo, switchValues }) => {
      const varb = focalSection.varbByFocalMixed(switchInfo);
      return switchValues.includes(varb.valueNext() as any);
    });
  }
  activePropVarbs(updateProp: UpdateFnProp) {
    const varbs = this.getterSection.varbsByFocalMixed(updateProp);
    return varbs.filter((varb) =>
      this.updatePropIsActive(varb.getterSection, updateProp)
    );
  }
  private updateFns = {
    varbExists: (): boolean => {
      const { updateFnProps } = this.inEntityVarb;
      const { varbInfo } = updateFnProps as { varbInfo: UpdateFnProp };
      const varbs = this.activePropVarbs(varbInfo);
      if (varbs.length > 0) return true;
      else return false;
    },
    financingDisplayName: (): StringObj => {
      const value = this.getterVarb.value("stringObj");
      const { updateFnProps } = this.inEntityVarb;
      const loanNameProps = updateFnProps.loanNames as UpdateFnProp[];
      let combined = "";
      for (let i = 0; i++; i < loanNameProps.length) {
        const nameProp = loanNameProps[i];
        const varb = this.getterSection.varbByFocalMixed(nameProp);
        if (i !== 0) {
          combined += " + ";
        }
        combined += varb.stringValue;
      }
      if (combined) {
        return {
          ...value,
          mainText: combined,
        };
      } else {
        return {
          ...value,
          mainText: "Cash Only",
        };
      }
    },
    notApplicable: (): NumObj => {
      return {
        ...this.getterVarb.value("numObj"),
        solvableText: notApplicableString,
      };
    },
    numberOne: (): 1 => 1,
    activeIsComplete: (): boolean => {
      const { sectionContextName } = this.getterSection;
      if (sectionContextName !== "activeDealSystem") {
        return this.getterVarb.value("boolean");
      } else {
        const { updateFnProps } = this.inEntityVarb;
        const varb = this.getterSection.varbByFocalMixed(
          updateFnProps.completionStatus as UpdateFnProp
        );
        return varb.value("completionStatus") === "allValid";
      }
    },
    completionStatus: (): UnionValue<"completionStatus"> => {
      const { updateFnProps } = this.inEntityVarb;
      const { nonZeros, validInputs, othersValid, nonNone, notFalse } =
        updateFnProps as CompletionStatusProps;

      let allEmpty = true;
      let allValid = true;

      const updateBools = ({
        isEmpty,
        isValid,
      }: {
        isEmpty: boolean;
        isValid: boolean;
      }) => {
        if (!isEmpty) allEmpty = false;
        if (!isValid) allValid = false;
      };

      for (const updateProp of othersValid) {
        const varbs = this.activePropVarbs(updateProp);
        for (const varb of varbs) {
          const value = varb.valueNext() as UnionValue<"completionStatus">;
          if (value === "allEmpty") {
            updateBools({ isEmpty: true, isValid: false });
          } else if (value === "someInvalid") {
            updateBools({ isEmpty: false, isValid: false });
          } else if (value === "allValid") {
            updateBools({ isEmpty: false, isValid: true });
          }
        }
      }

      for (const prop of notFalse) {
        const varbs = this.activePropVarbs(prop);
        for (const varb of varbs) {
          if (varb.value("boolean") === false) {
            updateBools({ isEmpty: false, isValid: false });
          } else {
            updateBools({ isEmpty: false, isValid: true });
          }
        }
      }

      for (const updateProp of validInputs) {
        const varbs = this.activePropVarbs(updateProp);
        for (const varb of varbs) {
          updateBools(varb.checkObjValue());
        }
      }

      for (const updateProp of nonZeros) {
        const varbs = this.activePropVarbs(updateProp);
        for (const varb of varbs) {
          if (varb.numberOrQuestionMark === 0) {
            updateBools({ isEmpty: false, isValid: false });
          } else {
            updateBools({ isEmpty: true, isValid: true });
          }
        }
      }

      for (const updateProp of nonNone) {
        const varbs = this.activePropVarbs(updateProp);
        for (const varb of varbs) {
          if (varb.valueNext() === "none") {
            updateBools({ isEmpty: true, isValid: false });
          } else {
            updateBools({ isEmpty: false, isValid: true });
          }
        }
      }

      if (allEmpty) return "allEmpty";
      if (allValid) return "allValid";
      else return "someInvalid";
    },
    defaultDealDisplayName: (): StateValue<"stringObj"> => {
      const { getterSection } = this;
      if (getterSection.isOfSectionName("deal")) {
        const mainText = makeDefaultDealDisplayName(getterSection);
        return {
          ...getterSection.valueNext("displayName"),
          mainText,
        };
      } else {
        throw new Error("This only works with deals.");
      }
    },
    manualUpdateOnly: (): StateValue => {
      return this.getterVarb.value();
    },
    throwIfReached: () => {
      throw new Error(
        `Varb ${this.sectionName}.${this.varbName} should have had an updateOverride take effect but didn't.`
      );
    },
    loadNumObj: (): NumObj => {
      const { updateFnProps } = this.inEntityVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.varbInfo as RelVarbInfo
      );
      return varb.value("numObj");
    },
    solvableTextZero: (): NumObj => {
      return {
        ...this.getterVarb.value("numObj"),
        solvableText: "0",
      };
    },
    solvableTextPointZeroFive: (): NumObj => {
      return {
        ...this.getterVarb.value("numObj"),
        solvableText: "0.05",
      };
    },
    solvableTextPointEightFive: (): NumObj => {
      return {
        ...this.getterVarb.value("numObj"),
        solvableText: "0.85",
      };
    },
    solvableTextPointOneFive: (): NumObj => {
      return {
        ...this.getterVarb.value("numObj"),
        solvableText: "0.15",
      };
    },
    solvableTextPointOne: (): NumObj => {
      return {
        ...this.getterVarb.value("numObj"),
        solvableText: "0.1",
      };
    },
    emptyNumObj: (): NumObj => {
      return numObj("");
    },
    getNumObjOfSwitch: (): NumObj => {
      const { updateFnProps } = this.inEntityVarb;
      const { getterSection: get } = this;
      const switchVarb = get.varbByFocalMixed(
        updateFnProps.switch as UpdateFnProp
      );
      const stringSwitch = switchVarb.value("string");
      const valueVarb = get.varbByFocalMixed(
        updateFnProps[stringSwitch] as UpdateFnProp
      );
      return calculatedNumObj(valueVarb.value("numObj").solvableText);
    },
    loadMainTextByVarbInfo: (): StringObj => {
      const { updateFnProps } = this.inEntityVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.varbInfo as PathInVarbInfo
      );
      return stringObj(varb.value("stringObj").mainText);
    },
    localStringToStringObj: (): StringObj => {
      const { updateFnProps } = this.inEntityVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.localString as PathInVarbInfo
      );
      return stringObj(varb.value("string"));
    },
    loadSolvableTextByVarbInfo: (): NumObj => {
      const { updateFnProps } = this.inEntityVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.varbInfo as UpdateFnProp
      );
      return calculatedNumObj(varb.value("numObj").solvableText);
    },
    loadValueEditorSolvableText: (): NumObj => {
      const value = this.getterVarb.value("numObj");
      const { solvableText } = this.getterVarb.localValue(
        "valueEditor",
        "numObj"
      );
      return { ...value, solvableText };
    },
    virtualNumObj: (): NumObj => {
      return {
        ...this.loadNextTexts(),
        entities: this.loadNextEntities(),
      };
    },
    calcVarbs: (): NumObj => {
      const current = this.getterVarb.value("numObj");
      const solvableText = this.solvableTextFromCalcVarbs();
      return {
        ...current,
        solvableText,
      };
    },
    calculation: (): NumObj => {
      const solvableText = this.solvableTextFromCalculation();
      return calculatedNumObj(solvableText);
    },
    userVarb: (): NumObj => {
      const section = this.getterSection;
      if (section.sectionName === "numVarbItem") {
        const userVarbSolver = new UserVarbValueSolver(
          this.getterSectionProps as GetterSectionProps<"numVarbItem">
        );
        const editor = (
          section as any as GetterSection<"numVarbItem">
        ).varbNext("valueEditor");
        const editorEntities = editor.value("numObj").entities;
        let isPureUserVarb = true;
        for (const entity of editorEntities) {
          if (section.hasVarbByFocalMixed(entity)) {
            const varb = section.varbByFocalMixed(entity);
            if (!(varb.sectionName === "numVarbItem")) {
              isPureUserVarb = false;
              break;
            } else if (!varb.isPureUserVarb) {
              isPureUserVarb = false;
              break;
            }
          }
        }
        const editorUpdater = new UpdaterVarb(editor.getterVarbProps);
        editorUpdater.update({ isPureUserVarb });
        return userVarbSolver.solveValue();
      } else throw new Error("section must contain at least one varb");
    },
    conditionalValue: (): NumObj => {
      if (this.getterVarb.sectionName === "conditionalRowList") {
        const solver = new ConditionalValueSolver(
          this.getterSectionProps as GetterSectionProps<"conditionalRowList">
        );
        return solver.solveValue();
      } else {
        throw new Error("This only works with conditionalRowList");
      }
    },
    emptyStringObj: (): StringObj => {
      return stringObj("");
    },
    loadDisplayName: (): StringObj => {
      return this.valueEntityVarbProp("displayName", "Variable not found");
    },
    loadDisplayNameEnd: (): StringObj => {
      return this.valueEntityVarbProp("displayNameEnd", "");
    },
    loadStartAdornment: (): StringObj => {
      return this.valueEntityVarbProp("startAdornment", "");
    },
    loadEndAdornment: (): StringObj => {
      return this.valueEntityVarbProp("endAdornment", "");
    },
  };
  private valueEntityVarbProp(
    varbPropName: VirtualVarbName,
    notFoundString: string
  ): StringObj {
    const section = this.getterSection;
    const entityInfo = this.getterSection.value(
      "valueEntityInfo",
      "inEntityValue"
    );
    if (!entityInfo) {
      return stringObj("");
    }
    if (section.hasSectionByFocalMixed(entityInfo)) {
      const varb = section.varbByFocalMixed(entityInfo);
      return stringObj(varb[varbPropName]);
    } else {
      return stringObj(notFoundString);
    }
  }
  solveValue(): StateValue {
    const { updateFnName } = this.inEntityVarb;
    if (isCalculationName(updateFnName)) return this.updateFns.calculation();
    if (this.isInUpdateFns(updateFnName)) return this.updateFns[updateFnName]();
    else throw new Error(`updateFnName ${updateFnName} not found.`);
  }
  private loadNextEntities(): ValueInEntity[] {
    const varb = this.inEntityVarb;
    let nextEntities = [...varb.valueInEntities];
    const infoVarb = varb.get.localVarb("valueEntityInfo");

    const entitySource = "localValueEntityInfo";
    function entityIsOfSource(entity: ValueInEntity) {
      return entity.entitySource === entitySource;
    }
    function removeEntityOfSource() {
      Arr.findAndRmMutate(nextEntities, entityIsOfSource);
    }
    function pushEntityOfSource(entityInfo: InEntityValueInfo) {
      nextEntities.push({
        ...entityInfo,
        entitySource: entitySource,
        length: 0,
        offset: 0,
      });
    }

    const entityInfo = infoVarb.value("inEntityValue");
    const entityOfSource = nextEntities.find(entityIsOfSource);
    if (entityInfo) {
      if (!entityOfSource) {
        pushEntityOfSource(entityInfo);
      } else {
        const entityIsUpToDate =
          entityOfSource.entityId === entityInfo.entityId;
        if (!entityIsUpToDate) {
          removeEntityOfSource();
          pushEntityOfSource(entityInfo);
        }
      }
    } else if (!entityInfo && entityOfSource) {
      removeEntityOfSource();
    }
    return nextEntities;
  }
  private loadNextTexts(): { mainText: string; solvableText: string } {
    const section = this.getterSection;
    const loadingVarbInfo = section.value("valueEntityInfo", "inEntityValue");
    if (loadingVarbInfo && section.hasSectionByFocalMixed(loadingVarbInfo)) {
      const varb = section.varbByFocalMixed(loadingVarbInfo);
      return {
        solvableText: varb.value("numObj").solvableText,
        mainText:
          varb.numberOrQuestionMark === "?" ? "" : `${varb.numberValue}`,
      };
    } else {
      return {
        solvableText: "?",
        mainText: "",
      };
    }
  }
  private isInUpdateFns(str: string): str is keyof typeof this.updateFns {
    return str in this.updateFns;
  }
  private solvableTextFromCalcVarbs(): string {
    if (this.inEntityVarb.updateFnName !== "calcVarbs")
      throw new Error("This is only for calcVarbs");
    const numObj = this.getterVarb.value("numObj");
    return this.numObjSolver.solvableTextFromTextAndEntities(numObj);
  }
  private solvableTextFromCalculation() {
    const { updateFnName } = this.inEntityVarb;
    if (!isCalculationName(updateFnName))
      throw new Error(
        `updateFnName is ${updateFnName}, but this is only for pure calculations`
      );

    const { updateFnProps } = this.inEntityVarb;
    const { numberVarbs } = this.getNumberVarbs(updateFnProps);
    const solvableText = calculations[updateFnName](numberVarbs as any);
    if (solvableText.includes("NaN")) {
      throw new Error(
        `solvableText "${solvableText}" includes NaN; derived from updateFn "${updateFnName}"`
      );
    }
    return solvableText;
  }
  private getNumberVarbs(updateFnProps: UpdateFnProps): {
    numberVarbs: NumberProps;
    failedVarbs: FailedVarbs;
  } {
    const numberVarbs: NumberProps = {};
    const failedVarbs: FailedVarbs = [];
    for (let [propName, propOrArr] of Obj.entries(updateFnProps)) {
      if (Array.isArray(propOrArr)) numberVarbs[propName] = [];
      else propOrArr = [propOrArr];
      for (const relInfo of propOrArr) {
        const inVarbs = this.getterSection.varbsByFocalMixed(relInfo);
        for (const inVarb of inVarbs) {
          if (inVarb.hasValueType("numObj") || inVarb.hasValueType("number")) {
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
          } else {
            numberVarbs[propName] = inVarb.value() as any;
          }
        }
      }
    }
    return { numberVarbs, failedVarbs };
  }
}

export type FailedVarbs = FailedVarb[];
type FailedVarb = { errorMessage: string } & UpdateVarbInfo;
type UpdateVarbInfo = PathInVarbInfo | DbVarbInfoMixed;
