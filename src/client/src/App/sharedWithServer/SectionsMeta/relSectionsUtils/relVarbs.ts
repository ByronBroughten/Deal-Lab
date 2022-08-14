import { Obj } from "../../utils/Obj";
import { baseSections, SimpleSectionName } from "../baseSections";
import {
  BaseName,
  VarbNameNext,
  VarbNameNextByType,
} from "../baseSectionsDerived/baseSectionTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { switchNames } from "../baseSectionsUtils/RelSwitchVarb";
import { ChildName } from "../childSectionsDerived/ChildName";
import { relVarbInfoS } from "../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../childSectionsDerived/RelVarbInfos";
import { relVarb, relVarbS } from "./rel/relVarb";
import {
  MonthlyYearlySwitchOptions,
  monthsYearsInput,
  ongoingInput,
  ongoingPercentToPortion,
  ongoingPureCalc,
  ongoingSumNums,
  SwitchRelVarbs,
} from "./rel/relVarbs/relOngoingVarbs";
import { switchInput } from "./rel/relVarbs/relSwitchVarbs";
import { RelVarb, RelVarbByType } from "./rel/relVarbTypes";

export type GeneralRelVarbs = Record<string, RelVarb>;
export type RelVarbs<SN extends SimpleSectionName> = Record<
  VarbNameNext<SN>,
  RelVarb
>;

type RelVarbsByType<SN extends SimpleSectionName, VLN extends ValueName> = Pick<
  RelVarbs<SN>,
  VarbNameNextByType<SN, VLN>
>;

function isRelVarbOfType<SN extends BaseName<"hasVarb">, VLN extends ValueName>(
  sectionName: SN,
  varbName: VarbNameNext<SN>,
  valueName: VLN,
  _value: any
): _value is RelVarbByType[VLN] {
  const schema = baseSections[sectionName];
  const varbType =
    schema.varbSchemas[varbName as keyof typeof schema.varbSchemas];
  return varbType === valueName;
}

function filterRelVarbsByType<
  SN extends BaseName<"hasVarb">,
  VLN extends ValueName
>(
  sectionName: SN,
  valueName: VLN,
  relVarbs: RelVarbs<SN>
): RelVarbsByType<SN, VLN> {
  const partial: Partial<RelVarbsByType<SN, VLN>> = {};
  for (const [varbName, relVarb] of Obj.entriesFull(relVarbs)) {
    if (isRelVarbOfType(sectionName, varbName, valueName, relVarb))
      partial[varbName as keyof RelVarbsByType<SN, VLN>] = relVarb;
  }
  return partial as RelVarbsByType<SN, VLN>;
}

export type StringPreVarbsFromNames<VN extends readonly string[]> = Record<
  VN[number],
  RelVarbByType["string"]
>;
export const relVarbsS = {
  strings<VN extends readonly string[]>(
    varbNames: VN
  ): StringPreVarbsFromNames<VN> {
    return varbNames.reduce(
      (relVarbs, varbName): Partial<StringPreVarbsFromNames<VN>> => {
        return {
          ...relVarbs,
          [varbName]: relVarb("string"),
        };
      },
      {} as Partial<StringPreVarbsFromNames<VN>>
    ) as StringPreVarbsFromNames<VN>;
  },
  get savableSection() {
    return {
      ...this.strings([
        "displayName",
        "dateTimeFirstSaved",
        "dateTimeLastSaved",
      ] as const),
    };
  },
  ongoingPureCalc,
  ongoingPercentToPortion,
  ongoingSumNums,
  ongoingInput,
  monthsYearsInput,
  switchInput,
  timeMoneyInput<Base extends string>(
    varbNameBase: Base,
    displayName: string,
    options: MonthlyYearlySwitchOptions = {}
  ): SwitchRelVarbs<Base, "ongoing"> {
    return this.ongoingInput(varbNameBase, displayName, {
      ...options,
      shared: { ...options.shared, startAdornment: "$" },
    });
  },
  sectionStrings<
    SN extends BaseName<"hasVarb">,
    PV extends RelVarbs<SN>,
    ToSkip extends readonly (keyof PV)[] = []
  >(sectionName: SN, relVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<SN, "string">, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in relVarbs && !toSkip?.includes(value);
    }
    const ssPreVarbs: Partial<ToReturn> = {};
    const stringPreVarbs = filterRelVarbsByType(
      sectionName,
      "string",
      relVarbs
    );
    for (const [varbName, relVarb] of Obj.entriesFull(stringPreVarbs)) {
      if (isInToReturn(varbName) && typeof varbName === "string") {
        ssPreVarbs[varbName] = relVarb;
      }
    }
    return ssPreVarbs as ToReturn;
  },
  sumSection<
    SN extends BaseName<"hasVarb"> & ChildName,
    RV extends RelVarbs<SN>,
    ToSkip extends readonly (keyof RV)[] = []
  >(sectionName: SN, relVarbs: RV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<SN, "numObj">, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in relVarbs && !toSkip?.includes(value);
    }

    const ssPreVarbs: Partial<ToReturn> = {};
    const numObjPreVarbs = filterRelVarbsByType(
      sectionName,
      "numObj",
      relVarbs
    );
    for (const [varbName, pVarb] of Obj.entriesFull(numObjPreVarbs)) {
      if (isInToReturn(varbName) && typeof varbName === "string") {
        const { displayName, startAdornment, endAdornment, displayNameEnd } =
          pVarb;
        ssPreVarbs[varbName] = relVarbS.sumNums(
          displayName,
          [relVarbInfoS.children(sectionName, varbName)],
          { startAdornment, endAdornment, displayNameEnd }
        );
      }
    }
    return ssPreVarbs as ToReturn;
  },
  get basicVirtualVarb() {
    return {
      displayName: relVarb("stringObj", {
        updateFnName: "loadDisplayName",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
        },
      }),
      displayNameEnd: relVarb("stringObj", {
        updateFnName: "loadDisplayNameEnd",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
        },
      }),
      startAdornment: relVarb("stringObj", {
        updateFnName: "loadStartAdornment",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
        },
      }),
      endAdornment: relVarb("stringObj", {
        updateFnName: "loadEndAdornment",
        updateFnProps: {
          varbInfo: relVarbInfoS.local("valueEntityInfo"),
        },
      }),
    } as const;
  },
  get listItemVirtualVarb() {
    return {
      valueEntityInfo: relVarb("inEntityInfo"),
      displayNameEditor: relVarbS.displayNameEditor,
      displayName: relVarb("stringObj", {
        updateFnName: "loadLocalString",
        updateFnProps: {
          loadLocalString: relVarbInfoS.local("displayNameEditor"),
        },
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadDisplayName",
            updateFnProps: relVarbInfosS.localByVarbName([
              "valueSwitch",
              "valueEntityInfo",
            ]),
          },
        ],
      }),
      displayNameEnd: relVarb("stringObj", {
        updateFnName: "emptyStringObj",
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadDisplayNameEnd",
            updateFnProps: relVarbInfosS.localByVarbName([
              "valueSwitch",
              "valueEntityInfo",
            ]),
          },
        ],
      }),
      startAdornment: relVarb("stringObj", {
        updateFnName: "emptyStringObj",
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadStartAdornment",
            updateFnProps: relVarbInfosS.localByVarbName([
              "valueSwitch",
              "valueEntityInfo",
            ]),
          },
        ],
      }),
      endAdornment: relVarb("stringObj", {
        updateFnName: "emptyStringObj",
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadEndAdornment",
            updateFnProps: relVarbInfosS.localByVarbName([
              "valueSwitch",
              "valueEntityInfo",
            ]),
          },
        ],
      }),
    } as const;
  },
  singleTimeItem(): RelVarbs<"singleTimeItem"> {
    const valueSwitchProp = relVarbInfoS.local("valueSwitch");
    return {
      ...this.listItemVirtualVarb,
      value: relVarbS.numObj(relVarbInfoS.local("displayName"), {
        updateFnName: "loadEditorSolvableText",
        updateFnProps: {
          proxyValue: relVarbInfoS.local("numObjEditor"),
          valueSwitch: valueSwitchProp,
        },
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              varbInfo: relVarbInfoS.local("valueEntityInfo"),
              valueSwitch: valueSwitchProp,
            },
          },
          // the total is updating right away.
          // and the total must update based on
        ],
        startAdornment: "$",
        unit: "decimal",
      }),
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      numObjEditor: relVarbS.calcVarb("", { startAdornment: "$" }),
    };
  },
  ongoingItem(): RelVarbs<"ongoingItem"> {
    const ongoingValueNames = switchNames("value", "ongoing");
    const defaultValueUpdatePack = {
      updateFnName: "loadEditorSolvableText",
      updateFnProps: relVarbInfosS.localByVarbName([
        "numObjEditor",
        "valueSwitch",
      ]),
    } as const;
    const ongoingSwitchInfo = relVarbInfoS.local(ongoingValueNames.switch);
    const valueSwitchProp = relVarbInfoS.local("valueSwitch");
    return {
      ...this.listItemVirtualVarb,
      valueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      costToReplace: relVarbS.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),
      numObjEditor: relVarbS.calcVarb("", {
        startAdornment: "$",
        endAdornment: "provide adornment to editor",
      }),
      ...relVarbsS.monthsYearsInput("lifespan", "Average lifespan", {
        switchInit: "years",
      }),
      [ongoingValueNames.switch]: relVarb("string", {
        initValue: "monthly",
      }),
      // So... that's the numObjEditor, is that right?

      [ongoingValueNames.monthly]: relVarbS.moneyMonth("Monthly amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "yearly",
            updateFnName: "yearlyToMonthly",
            updateFnProps: {
              num: relVarbInfoS.local(ongoingValueNames.yearly),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              varbInfo: relVarbInfoS.local("valueEntityInfo"),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfoS.local("costToReplace"),
              rightSide: relVarbInfoS.local("lifespanMonths"),
            },
          },
        ],
        unit: "decimal",
      }),
      [ongoingValueNames.yearly]: relVarbS.moneyYear("Annual amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "monthly",
            updateFnName: "monthlyToYearly",
            updateFnProps: {
              num: relVarbInfoS.local(ongoingValueNames.monthly),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              varbInfo: relVarbInfoS.local("valueEntityInfo"),
            },
          },
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfoS.local("costToReplace"),
              rightSide: relVarbInfoS.local("lifespanYears"),
            },
          },
        ],
        unit: "decimal",
      }),
    };
  },
  singleTimeList(): RelVarbs<"singleTimeList"> {
    return {
      ...this.savableSection,
      total: relVarbS.sumNums(
        relVarbInfoS.local("displayName"),
        [relVarbInfoS.children("singleTimeItem", "value")],
        { startAdornment: "$" }
      ),
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
    };
  },
  ongoingList(): RelVarbs<"ongoingList"> {
    return {
      ...this.savableSection,
      defaultValueSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb("string", {
        initValue: "monthly",
      }),
      ...relVarbsS.ongoingSumNums(
        "total",
        relVarbInfoS.local("displayName"),
        [relVarbInfoS.children("ongoingItem", "value")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    };
  },
};
