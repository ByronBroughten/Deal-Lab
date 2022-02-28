import Analyzer from "../../../Analyzer";
import {
  FeNameInfo,
  FeVarbInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { NumObj } from "../../SectionMetas/relSections/baseSections/baseValues/NumObj";
import { isCalculationName } from "../../SectionMetas/relSections/rel/relValues/numObjUpdateInfos/calculationUpdates";
import { BasicNumObjInherentProps, numObjUpdates } from "../../SectionMetas/relSections/rel/relValues/numObjUpdates";
import { ConditionalRowValues } from "../../SectionMetas/relSections/rel/relValues/numObjUpdateInfos/userVarbUpdate";
import { entitiesToNumberEntities } from "./solveAndUpdateValue/entitiesToNumberEntities";
import { GatherName, GatherProps } from "../../SectionMetas/relSections/rel/relValues/gatherProps";
import { BaseValue, BaseValueName, BaseValueTypes } from "../../SectionMetas/relSections/baseSections/baseValues";
import { BaseVarbInfo, BaseInfoValue } from "../../SectionMetas/relSections/baseVarbInfo";

type GatherPropFns = {
  [Prop in GatherName]: () => GatherProps<Prop>
}



// I will also need the valueType, which I will be able to get from feVarbInfo
function gatherProps<I extends BaseVarbInfo>(analyzer: Analyzer, feVarbInfo: I, directValue: BaseInfoValue<I>) {
  // I should get valueBased on varbInfo

  // I could force directValue to match the FeVarbInfo type
  // can I deduce the type from FeVarbInfo?
  // Yeah, I kinda can.

  function gatherBasicNumObjProps(): BasicNumObjInherentProps {
    const updateName = analyzer.updateFnName(feVarbInfo);
    return {
      current: analyzer.value(feVarbInfo, "numObj"),
      roundTo: NumObj.units.[metaInfo].roundTo,
      finishingTouch: NumObj.isFinishingTouch(updateName) ? updateName : undefined
    }
  }

  // for the calculation ones, I can use a function that gets the basic props
  // then gathers the props based on each varb's meta
  const gatherPropFns: GatherPropFns = {
    direct() {
      return { value: directValue }
    },
    none() { return {} },
    currentAndLoaded() {
      const current = analyzer.value(feVarbInfo, "numObj");
      const loadingVarbInfo = analyzer.varbInfoValues(feVarbInfo);
      const loaded = analyzer.findValue(loadingVarbInfo, "numObj");
      return { current, loaded };
    },
    currentAndEditor() {
      const current = analyzer.value(feVarbInfo, "numObj");
      const editor = analyzer.feValue("editorValue", feVarbInfo, "numObj");
      return { current, editor };
    },
    loadedDisplayName() {
      const loadedVarbInfo = analyzer.varbInfoValues(feVarbInfo);
      const loadedVarb = analyzer.findVarb(loadedVarbInfo);
      return {
        loadedDisplayName: loadedVarb ? analyzer.displayName(loadedVarbInfo) : undefined
      } 
    },
    numberEntities() {
      const { current, ...basicProps } = gatherBasicNumObjProps();
      const numberEntities = entitiesToNumberEntities(
        analyzer,
        current.entities
      );
      return {
        current,
        ...basicProps,
        numberEntities,
      };
    },
    editorOrRowValues() {
      function getRowValues() {
        const rowValues: ConditionalRowValues[] = [];
        const rows = analyzer.children(feInfo, "conditionalRow");
        for (const row of rows) {
          rowValues.push(
            row.values({
              type: "string",
              level: "number",
              left: "numObj",
              operator: "string",
              rightList: "stringArray",
              rightValue: "numObj",
              then: "numObj",
            })
          );
        }
        return rowValues;
      }

      if (!(feVarbInfo.sectionName === "userVarbItem"))
        throw new Error("For now, this is only for userVarbItem");
      const feInfo = feVarbInfo as FeNameInfo<"userVarbItem">;
      const section = analyzer.section(feInfo);
      const varbType = section.varbs["valueSwitch"].value("string") as
        | "labeledEquation"
        | "ifThen";

      return {
        editorOrRowValues: (varbType === "labeledEquation") ? section.varb("editorValue").value("numObj") : getRowValues()
      }
    },
  }
}

export function solveValue<I extends BaseVarbInfo>(
  this: Analyzer,
  feVarbInfo: I,
  directValue?: BaseInfoValue<I>
): BaseInfoValue<I> {
  // the other option is to make a different 

  if (directValue !== undefined) return directValue;
  const analyzer = this;

  const updateFns = {
    loadedNumObj(): NumObj {
      const props = gatherProps.currentAndLoaded();
      return numObjUpdates.loadedVarb.fn(props);
    },
    userVarb(): NumObj {
      const props = gatherProps.editorOrRowValues();
      return numObjUpdates.userVarb.fn(props);
    },
    editorValue(): NumObj {
      const props = gatherProps.currentAndEditor();
      return numObjUpdates.editorValue.fn(props);
    },
    calcVarbs(): NumObj {
      const props = gatherProps.numberEntities();
      return numObjUpdates.entityEditor.fn(props);
    },
    loadedDisplayName(): string {
      const varbInfo = analyzer.varbInfoValues(feVarbInfo);
      const varb = analyzer.findVarb(varbInfo);
      if (!varb) return "Variable not found.";
      else return analyzer.displayName(feVarbInfo);
    },


    calculation(): NumObj {
      const solvableText = analyzer.solvableTextFromCalculation(feVarbInfo);
      const number = analyzer.solvableTextToNumber(feVarbInfo, solvableText);
      const numObj = analyzer.value(feVarbInfo, "numObj");
      const nextNumObj = numObj.updateCache({
        solvableText,
        number,
      });
      return nextNumObj.updateCore({
        editorText: `${nextNumObj.solvableText}`,
        entities: [],
      });
    }, // each updateFn will have a gather method
  };
  function isInUpdateFns(str: string): str is keyof typeof updateFns {
    return str in updateFns;
  }

  // 

  const updateFnName = this.updateFnName(feVarbInfo);
  if (isCalculationName(updateFnName)) return updateFns.calculation();
  if (isInUpdateFns(updateFnName)) return updateFns[updateFnName]();
  else return undefined;
}

export function solveAndUpdateValue(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): Analyzer {
  const newValue = this.solveValue(feVarbInfo);
  if (newValue !== undefined)
    return this.updateValueDirectly(feVarbInfo, newValue);
  else return this;
}
