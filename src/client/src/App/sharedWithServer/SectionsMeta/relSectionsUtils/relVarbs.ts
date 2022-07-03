import { Obj } from "../../utils/Obj";
import { baseSections, SimpleSectionName } from "../baseSections";
import {
  BaseName,
  SectionVarbName,
  SectionVarbNameByType,
} from "../baseSectionsDerived/baseSectionTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { switchNames } from "../baseSectionsUtils/switchNames";
import { relProps } from "./rel/relMisc";
import { relVarbS } from "./rel/relVarb";
import { relVarbInfo } from "./rel/relVarbInfo";
import {
  MonthlyYearlySwitchOptions,
  monthsYearsInput,
  ongoingInput,
  ongoingPercentToPortion,
  ongoingPureCalc,
  ongoingSumNums,
} from "./rel/relVarbs/preOngoingVarbs";
import { simpleSwitch, switchInput } from "./rel/relVarbs/preSwitchVarbs";
import {
  DisplayName,
  RelVarb,
  RelVarbByType,
  StringPreVarb,
} from "./rel/relVarbTypes";

export type GeneralRelVarbs = Record<string, RelVarb>;
export type RelVarbs<SN extends SimpleSectionName> = Record<
  SectionVarbName<SN>,
  RelVarb
>;

type RelVarbsByType<SN extends SimpleSectionName, VLN extends ValueName> = Pick<
  RelVarbs<SN>,
  SectionVarbNameByType<SN, VLN>
>;

function isRelVarbOfType<SN extends BaseName<"hasVarb">, VLN extends ValueName>(
  sectionName: SN,
  varbName: SectionVarbName<SN>,
  valueName: VLN,
  _value: any
): _value is RelVarbByType[VLN] {
  const schema = baseSections["fe"][sectionName];
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
          [varbName]: relVarbS.string(),
        };
      },
      {} as Partial<StringPreVarbsFromNames<VN>>
    ) as StringPreVarbsFromNames<VN>;
  },
  get savableSection() {
    return {
      ...this.strings([
        "title",
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
    SN extends BaseName<"hasVarb", "fe">,
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
    S extends BaseName<"hasVarb">,
    PV extends RelVarbs<S>,
    ToSkip extends readonly (keyof PV)[] = []
  >(sectionName: S, relVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<S, "numObj">, keyof ToSkip>;
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
        const { displayName, startAdornment, endAdornment } = pVarb;
        ssPreVarbs[varbName] = relVarbS.sumNums(
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
      entityId: relVarbS.string(),
    } as {
      sectionName: StringPreVarb;
      varbName: StringPreVarb;
      id: StringPreVarb;
      idType: StringPreVarb;
      entityId: StringPreVarb;
    };
  },
  singleTimeItem<R extends RelVarbs<"singleTimeItem">>(): R {
    const sectionName = "singleTimeItem";
    const valueSwitchProp = relVarbInfo.local(sectionName, "valueSwitch");
    const r: R = {
      name: relVarbS.stringOrLoaded(sectionName),
      valueSwitch: relVarbS.string({
        initValue: "labeledEquation",
      }),
      ...relVarbsS.entityInfo(),
      editorValue: relVarbS.calcVarb("", { startAdornment: "$" }),
      value: relVarbS.numObj(relVarbInfo.local(sectionName, "name"), {
        updateFnName: "editorValue",
        updateFnProps: {
          proxyValue: relVarbInfo.local(sectionName, "editorValue"),
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
              ...relProps.loadedVarb(sectionName),
              valueSwitch: valueSwitchProp,
            },
          },
        ],
        startAdornment: "$",
      }),
    } as R;
    return r;
  },
  ongoingItem<R extends RelVarbs<"ongoingItem">>(): R {
    const sectionName = "ongoingItem";
    const ongoingValueNames = switchNames("value", "ongoing");

    const defaultValueUpdatePack = {
      updateFnName: "editorValue",
      updateFnProps: relProps.locals("ongoingItem", [
        "editorValue",
        "valueSwitch",
      ]),
    } as const;
    const ongoingSwitchInfo = relVarbInfo.local(
      sectionName,
      ongoingValueNames.switch
    );
    const valueSwitchProp = relVarbInfo.local(sectionName, "valueSwitch");
    const r: R = {
      name: relVarbS.stringOrLoaded(sectionName),
      valueSwitch: relVarbS.string({
        initValue: "labeledEquation",
      }),

      ...relVarbsS.entityInfo(),
      costToReplace: relVarbS.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),

      editorValue: relVarbS.calcVarb("", {
        startAdornment: "$",
        endAdornment: "provide adornment to editor",
      }),
      ...relVarbsS.monthsYearsInput(
        "lifespan",
        "Average lifespan",
        sectionName,
        { switchInit: "years" }
      ),
      [ongoingValueNames.switch]: relVarbS.string({
        initValue: "yearly",
      }),
      // So... that's the editorValue, is that right?

      [ongoingValueNames.monthly]: relVarbS.moneyMonth("Monthly amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "yearly",
            updateFnName: "yearlyToMonthly",
            updateFnProps: {
              num: relVarbInfo.local(sectionName, ongoingValueNames.yearly),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...relProps.loadedVarb(sectionName),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfo.local(sectionName, "costToReplace"),
              rightSide: relVarbInfo.local(sectionName, "lifespanMonths"),
            },
          },
        ],
      }),
      [ongoingValueNames.yearly]: relVarbS.moneyYear("Annual amount", {
        ...defaultValueUpdatePack,
        inUpdateSwitchProps: [
          {
            switchInfo: ongoingSwitchInfo,
            switchValue: "monthly",
            updateFnName: "monthlyToYearly",
            updateFnProps: {
              num: relVarbInfo.local(sectionName, ongoingValueNames.monthly),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedNumObj",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              ...relProps.loadedVarb(sectionName),
            },
          },
          {
            switchInfo: relVarbInfo.local(sectionName, "valueSwitch"),
            switchValue: "labeledSpanOverCost",
            updateFnName: "simpleDivide",
            updateFnProps: {
              valueSwitch: valueSwitchProp,
              leftSide: relVarbInfo.local(sectionName, "costToReplace"),
              rightSide: relVarbInfo.local(sectionName, "lifespanYears"),
            },
          },
        ],
      }),
    } as R;
    return r;
  },
  singleTimeList() {
    return {
      ...this.savableSection,
      total: relVarbS.sumNums(
        relVarbInfo.local("singleTimeList", "title"),
        [relVarbInfo.relative("singleTimeItem", "value", "children")],
        { startAdornment: "$" }
      ),
      defaultValueSwitch: relVarbS.string({
        initValue: "labeledEquation",
      }),
    } as RelVarbs<"singleTimeList">;
  },
  ongoingList(): RelVarbs<"ongoingList"> {
    return {
      ...this.savableSection,
      defaultValueSwitch: relVarbS.string({
        initValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarbS.string({
        initValue: "monthly",
      }),
      ...relVarbsS.ongoingSumNums(
        "total",
        relVarbInfo.local("ongoingList", "title"),
        [relVarbInfo.relative("ongoingItem", "value", "children")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    };
  },
};
