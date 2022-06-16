import { Obj } from "../../../utils/Obj";
import {
  baseSections,
  ContextName,
  SimpleSectionName,
} from "../../baseSections";
import { ValueName } from "../../baseSections/baseVarb";
import { switchNames } from "../../baseSections/switchNames";
import {
  BaseName,
  SectionVarbName,
  SectionVarbNameByType,
} from "../../baseSectionTypes";
import { relProps } from "./relMisc";
import { relVarb } from "./relVarb";
import { relVarbInfo } from "./relVarbInfo";
import {
  MonthlyYearlySwitchOptions,
  monthsYearsInput,
  ongoingInput,
  ongoingPercentToPortion,
  ongoingPureCalc,
  ongoingSumNums,
} from "./relVarbs/preOngoingVarbs";
import { simpleSwitch, switchInput } from "./relVarbs/preSwitchVarbs";
import {
  DisplayName,
  RelVarb,
  RelVarbByType,
  StringPreVarb,
} from "./relVarbTypes";

export type GeneralRelVarbs = Record<string, RelVarb>;
export type RelVarbs<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>
> = Record<SectionVarbName<SC, SN>, RelVarb>;

type RelVarbsByType<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  VLN extends ValueName
> = Pick<RelVarbs<SC, SN>, SectionVarbNameByType<SC, SN, VLN>>;

function isRelVarbOfType<
  SC extends ContextName,
  SN extends BaseName<"hasVarb", SC>,
  VLN extends ValueName
>(
  sectionContext: SC,
  sectionName: SN,
  varbName: SectionVarbName<SC, SN>,
  valueName: VLN,
  _value: any
): _value is RelVarbByType[VLN] {
  const schema = baseSections[sectionContext][sectionName];
  const varbType =
    schema.varbSchemas[varbName as keyof typeof schema.varbSchemas];
  return varbType === valueName;
}

function filterRelVarbsByType<
  SC extends ContextName,
  SN extends BaseName<"hasVarb", SC>,
  VLN extends ValueName
>(
  sectionContext: SC,
  sectionName: SN,
  valueName: VLN,
  relVarbs: RelVarbs<SC, SN>
): RelVarbsByType<SC, SN, VLN> {
  const partial: Partial<RelVarbsByType<SC, SN, VLN>> = {};
  for (const [varbName, relVarb] of Obj.entriesFull(relVarbs)) {
    if (
      isRelVarbOfType(sectionContext, sectionName, varbName, valueName, relVarb)
    )
      partial[varbName as keyof RelVarbsByType<SC, SN, VLN>] = relVarb;
  }
  return partial as RelVarbsByType<SC, SN, VLN>;
}

export type StringPreVarbsFromNames<VN extends readonly string[]> = Record<
  VN[number],
  RelVarbByType["string"]
>;
export const relVarbs = {
  strings<VN extends readonly string[]>(
    varbNames: VN
  ): StringPreVarbsFromNames<VN> {
    return varbNames.reduce(
      (relVarbs, varbName): Partial<StringPreVarbsFromNames<VN>> => {
        return {
          ...relVarbs,
          [varbName]: relVarb.string(),
        };
      },
      {} as Partial<StringPreVarbsFromNames<VN>>
    ) as StringPreVarbsFromNames<VN>;
  },
  get savableSection() {
    return {
      ...this.strings(["title", "dateTimeFirstSaved", "dateTimeLastSaved"]),
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
    PV extends RelVarbs<"fe", SN>,
    ToSkip extends (keyof PV)[] = []
  >(sectionName: SN, relVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<"fe", SN, "string">, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in relVarbs && !toSkip?.includes(value);
    }
    const ssPreVarbs: Partial<ToReturn> = {};
    const stringPreVarbs = filterRelVarbsByType(
      "fe",
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
    PV extends RelVarbs<"fe", S>,
    ToSkip extends readonly (keyof PV)[] = []
  >(sectionName: S, relVarbs: PV, toSkip?: ToSkip) {
    type ToReturn = Omit<RelVarbsByType<"fe", S, "numObj">, keyof ToSkip>;
    function isInToReturn(value: any): value is keyof ToReturn {
      return value in relVarbs && !toSkip?.includes(value);
    }

    const ssPreVarbs: Partial<ToReturn> = {};
    const numObjPreVarbs = filterRelVarbsByType(
      "fe",
      sectionName,
      "numObj",
      relVarbs
    );
    for (const [varbName, pVarb] of Obj.entriesFull(numObjPreVarbs)) {
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
  singleTimeItem<R extends RelVarbs<ContextName, "singleTimeItem">>(): R {
    const sectionName = "singleTimeItem";
    const valueSwitchProp = relVarbInfo.local(sectionName, "valueSwitch");
    const r: R = {
      name: relVarb.stringOrLoaded(sectionName),
      valueSwitch: relVarb.string({
        initValue: "labeledEquation",
        dbInitValue: "labeledEquation",
      }),
      ...relVarbs.entityInfo(),
      editorValue: relVarb.calcVarb("", { startAdornment: "$" }),
      value: relVarb.numObj(relVarbInfo.local(sectionName, "name"), {
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
  ongoingItem<R extends RelVarbs<ContextName, "ongoingItem">>(): R {
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
      name: relVarb.stringOrLoaded(sectionName),
      valueSwitch: relVarb.string({
        initValue: "labeledEquation",
        dbInitValue: "labeledEquation",
      }),

      ...relVarbs.entityInfo(),
      costToReplace: relVarb.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),

      editorValue: relVarb.calcVarb("", {
        startAdornment: "$",
        endAdornment: "provide adornment to editor",
      }),
      ...relVarbs.monthsYearsInput(
        "lifespan",
        "Average lifespan",
        sectionName,
        { switchInit: "years" }
      ),
      [ongoingValueNames.switch]: relVarb.string({
        initValue: "yearly",
        dbInitValue: "yearly",
      }),
      // So... that's the editorValue, is that right?

      [ongoingValueNames.monthly]: relVarb.moneyMonth("Monthly amount", {
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
      [ongoingValueNames.yearly]: relVarb.moneyYear("Annual amount", {
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
  singleTimeList<
    S extends BaseName<"singleTimeList">,
    R extends RelVarbs<ContextName, S>
  >(sectionName: S): R {
    const r: R = {
      ...this.savableSection,
      total: relVarb.sumNums(
        relVarbInfo.local(sectionName, "title"),
        [relVarbInfo.relative("singleTimeItem", "value", "children")],
        { startAdornment: "$" }
      ),
      defaultValueSwitch: relVarb.string({
        initValue: "labeledEquation",
        dbInitValue: "labeledEquation",
      }),
    } as R;
    return r;
  },
  ongoingList<
    S extends BaseName<"ongoingList">,
    R extends RelVarbs<ContextName, S>
  >(sectionName: S) {
    const r: R = {
      ...this.savableSection,
      defaultValueSwitch: relVarb.string({
        initValue: "labeledEquation",
        dbInitValue: "labeledEquation",
      }),
      defaultOngoingSwitch: relVarb.string({
        initValue: "monthly",
        dbInitValue: "monthly",
      }),
      ...relVarbs.ongoingSumNums(
        "total",
        relVarbInfo.local(sectionName, "title"),
        [relVarbInfo.relative("ongoingItem", "value", "children")],
        { switchInit: "monthly", shared: { startAdornment: "$" } }
      ),
    } as R;
    return r;
  },
};
