import { ObjectEntries } from "../../../../utils/Obj";
import {
  DisplayName,
  NumObjPreVarb,
  PreVarb,
  PreVarbByType,
  StringPreVarb,
} from "./relVarbTypes";
import { baseSections } from "../baseSections";
import {
  NumObjVarbName,
  BaseName,
  BaseSections,
  StringVarbName,
  VarbName,
} from "../baseSectionTypes";
import { relVarb } from "./relVarb";
import { switchNames } from "../baseSections/switchNames";
import { simpleSwitch, switchInput } from "./relVarbs/preSwitchVarbs";
import { preVarbInfo } from "./relVarbInfo";
import {
  monthsYearsInput,
  ongoingInput,
  ongoingPureCalc,
  ongoingSumNums,
  ongoingPercentToPortion,
  MonthlyYearlySwitchOptions,
} from "./relVarbs/preOngoingVarbs";
import { preProps } from "./relMisc";

export type PreVarbsGeneral = {
  [key: string]: PreVarb;
};
export type PreVarbs<S extends BaseName> = Record<
  keyof BaseSections[S]["varbSchemas"],
  PreVarb
>;

type StringPreVarbs<S extends BaseName> = Pick<PreVarbs<S>, StringVarbName<S>>;
type NumObjPreVarbs<S extends BaseName> = Pick<PreVarbs<S>, NumObjVarbName<S>>;
function isStringPreVarb<S extends BaseName>(
  sectionName: S,
  varbName: VarbName<S>,
  value: any
): value is StringPreVarb {
  const schema = baseSections[sectionName];
  const varbType =
    schema.varbSchemas[varbName as keyof typeof schema.varbSchemas];
  return varbType === "string";
}
function isNumObjPreVarb<S extends BaseName>(
  sectionName: S,
  varbName: VarbName<S>,
  value: any
): value is NumObjPreVarb {
  const schema = baseSections[sectionName];
  const varbType =
    schema.varbSchemas[varbName as keyof typeof schema.varbSchemas];
  return varbType === "numObj";
}
function filterStringPreVarbs<S extends BaseName>(
  sectionName: S,
  preVarbs: PreVarbs<S>
): StringPreVarbs<S> {
  const partial: Partial<StringPreVarbs<S>> = {};
  for (const [varbName, relVarb] of ObjectEntries(preVarbs)) {
    if (isStringPreVarb(sectionName, varbName, relVarb))
      partial[varbName as keyof StringPreVarbs<S>] = relVarb;
  }
  return partial as StringPreVarbs<S>;
}
function filterNumObjPreVarbs<S extends BaseName>(
  sectionName: S,
  preVarbs: PreVarbs<S>
): NumObjPreVarbs<S> {
  const partial: Partial<NumObjPreVarbs<S>> = {};
  for (const [varbName, relVarb] of ObjectEntries(preVarbs)) {
    if (isNumObjPreVarb(sectionName, varbName, relVarb))
      partial[varbName as keyof NumObjPreVarbs<S>] = relVarb;
  }
  return partial as NumObjPreVarbs<S>;
}

export type StringPreVarbsFromNames<VN extends readonly string[]> = Record<
  VN[number],
  PreVarbByType["string"]
>;
export const preVarbs = {
  strings<VN extends readonly string[]>(
    varbNames: VN
  ): StringPreVarbsFromNames<VN> {
    return varbNames.reduce(
      (preVarbs, varbName): Partial<StringPreVarbsFromNames<VN>> => {
        return {
          ...preVarbs,
          [varbName]: relVarb.string(),
        };
      },
      {} as Partial<StringPreVarbsFromNames<VN>>
    ) as StringPreVarbsFromNames<VN>;
  },
  ongoingPureCalc,
  ongoingPercentToPortion,
  ongoingSumNums,
  ongoingInput,
  monthsYearsInput,
  switch: simpleSwitch,
  switchInput,
  timeMoney(
    varbNameBase: string,
    displayName: DisplayName,
    sectionName: BaseName<"hasVarb">,
    options: MonthlyYearlySwitchOptions = {}
  ) {
    return this.ongoingInput(varbNameBase, displayName, sectionName, {
      ...options,
      shared: { ...options.shared, startAdornment: "$" },
    });
  },
  sectionStrings<
    S extends BaseName,
    PV extends PreVarbs<S>,
    ToSkip extends (keyof PV)[] = []
  >(sectionName: S, preVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<StringPreVarbs<S>, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in preVarbs && !toSkip?.includes(value);
    }
    const ssPreVarbs: Partial<ToReturn> = {};
    const stringPreVarbs = filterStringPreVarbs(sectionName, preVarbs);
    for (const [varbName, relVarb] of ObjectEntries(stringPreVarbs)) {
      if (isInToReturn(varbName) && typeof varbName === "string") {
        ssPreVarbs[varbName] = relVarb;
      }
    }
    return ssPreVarbs as ToReturn;
  },
  sumSection<
    S extends BaseName<"hasVarb">,
    PV extends PreVarbs<S>,
    ToSkip extends readonly (keyof PV)[] = []
  >(sectionName: S, preVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<NumObjPreVarbs<S>, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in preVarbs && !toSkip?.includes(value);
    }

    const ssPreVarbs: Partial<ToReturn> = {};
    const numObjPreVarbs = filterNumObjPreVarbs(sectionName, preVarbs);
    for (const [varbName, pVarb] of ObjectEntries(numObjPreVarbs)) {
      if (isInToReturn(varbName) && typeof varbName === "string") {
        const { displayName, startAdornment, endAdornment } = pVarb;
        ssPreVarbs[varbName] = relVarb.sumNums(
          displayName,
          [{ sectionName, varbName, id: "children", idType: "relative" }],
          { startAdornment, endAdornment }
        );
      }
    }
    return ssPreVarbs as ToReturn;
  },
  varbInfo(): StringPreVarbsFromNames<
    ["sectionName" | "varbName" | "id" | "idType"]
  > {
    return this.strings(["sectionName", "varbName", "id", "idType"] as const);
  },
  entityInfo() {
    return {
      ...this.varbInfo(),
      entityId: relVarb.string(),
    } as {
      sectionName: StringPreVarb;
      varbName: StringPreVarb;
      id: StringPreVarb;
      idType: StringPreVarb;
      entityId: StringPreVarb;
    };
  },
  singleTimeItem<S extends "singleTimeItem", R extends PreVarbs<S>>(): R {
    const sectionName = "singleTimeItem";
    const valueSwitchProp = preVarbInfo.local(sectionName, "valueSwitch");
    const r: R = {
      name: relVarb.stringOrLoaded(sectionName),
      valueSwitch: relVarb.string({ initValue: "labeledEquation" }),
      ...preVarbs.entityInfo(),
      editorValue: relVarb.calcVarb("", { startAdornment: "$" }),
      value: relVarb.numObj(preVarbInfo.local(sectionName, "name"), {
        updateFnName: "editorValue",
        updateFnProps: {
          proxyValue: preVarbInfo.local(sectionName, "editorValue"),
          valueSwitch: valueSwitchProp,
        },
        inUpdateSwitchProps: [
          {
            switchInfo: {
              sectionName,
              varbName: "valueSwitch",
              id: "local",
              idType: "relative",
            },
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              ...preProps.loadedVarb(sectionName),
              valueSwitch: valueSwitchProp,
            },
          },
        ],
        startAdornment: "$",
      }),
    } as R;
    return r;
  },
  ongoingItem<S extends "ongoingItem", R extends PreVarbs<S>>(): R {
    const sectionName = "ongoingItem";
    const ongoingValueNames = switchNames("value", "ongoing");

    const defaultValueUpdatePack = {
      updateFnName: "editorValue",
      updateFnProps: preProps.locals("ongoingItem", [
        "editorValue",
        "valueSwitch",
      ]),
    } as const;
    const ongoingSwitchInfo = preVarbInfo.local(
      sectionName,
      ongoingValueNames.switch
    );
    const valueSwitchProp = preVarbInfo.local(sectionName, "valueSwitch");
    const r: R = {
      name: relVarb.stringOrLoaded(sectionName),
      valueSwitch: relVarb.string({ initValue: "labeledEquation" }),

      ...preVarbs.entityInfo(),
      costToReplace: relVarb.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),

      editorValue: relVarb.calcVarb("", {
        startAdornment: "$",
        endAdornment: "/month",
      }),
      // ...preVarbs.ongoingInput("editorValue", "Item Value", sectionName),

      // Options
      // 1. Two editorValues
      // - When one is selected, the other just coppies its value
      // - OngoingValues just takes the value from one of them, as
      //   they're doing now.
      // - The same switch that controls which ongoingValue to use
      //   is also used to control which of the two editors to use
      //   But the editors are changed out just to show the right adornment

      // 2. One editorValue
      // - Keep things as they are, but hardcode a switch
      //   in AdditiveItem.

      // Before deciding, implement a regular switch of such nature
      // with taxes and home insurance

      ...preVarbs.monthsYearsInput(
        "lifespan",
        "Average lifespan",
        sectionName,
        { switchInit: "years" }
      ),
      [ongoingValueNames.switch]: relVarb.string({
        initValue: "monthly",
      }),
      [ongoingValueNames.monthly]: relVarb.moneyMonth("Monthly amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "yearly",
            updateFnName: "yearlyToMonthly",
            updateFnProps: {
              num: preVarbInfo.local(sectionName, ongoingValueNames.yearly),
            },
          },
          {
            switchInfo: preVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...preProps.loadedVarb(sectionName),
            },
          },
          {
            switchInfo: preVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: preVarbInfo.local(sectionName, "costToReplace"),
              rightSide: preVarbInfo.local(sectionName, "lifespanMonths"),
            },
          },
        ],
      }),
      [ongoingValueNames.yearly]: relVarb.moneyYear("Annual amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "monthly",
            updateFnName: "monthlyToYearly",
            updateFnProps: {
              num: preVarbInfo.local(sectionName, ongoingValueNames.monthly),
            },
          },
          {
            switchInfo: preVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...preProps.loadedVarb(sectionName),
            },
          },
          {
            switchInfo: preVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: preVarbInfo.local(sectionName, "costToReplace"),
              rightSide: preVarbInfo.local(sectionName, "lifespanYears"),
            },
          },
        ],
      }),
    } as R;
    return r;
  },
  singleTimeList<S extends BaseName<"singleTimeList">, R extends PreVarbs<S>>(
    sectionName: S
  ): R {
    const r: R = {
      total: relVarb.sumNums(
        preVarbInfo.local(sectionName, "title"),
        [preVarbInfo.relative("singleTimeItem", "value", "children")],
        { startAdornment: "$" }
      ),
      title: relVarb.string(),
      defaultValueSwitch: relVarb.string({
        initValue: "labeledEquation",
      }),
    } as R;
    return r;
  },
  ongoingList<S extends BaseName<"ongoingList">, R extends PreVarbs<S>>(
    sectionName: S
  ) {
    const r: R = {
      title: relVarb.string(),
      defaultValueSwitch: relVarb.string({
        initValue: "labeledEquation",
      }),
      ...preVarbs.ongoingSumNums(
        "total",
        preVarbInfo.local(sectionName, "title"),
        [preVarbInfo.relative("ongoingItem", "value", "children")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    } as R;
    return r;
  },
};
