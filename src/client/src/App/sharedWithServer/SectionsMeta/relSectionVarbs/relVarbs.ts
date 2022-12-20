import { Obj } from "../../utils/Obj";
import {
  VarbName,
  VarbNameByValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { baseSectionsVarbs } from "../baseSectionsVarbs";
import { ValueName } from "../baseSectionsVarbs/baseVarb";
import { switchNames } from "../baseSectionsVarbs/RelSwitchVarb";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { relVarbInfosS } from "../SectionInfo/RelVarbInfos";
import { SectionName } from "../SectionName";
import { relVarb, relVarbS } from "./rel/relVarb";
import {
  decimalToPortion,
  MonthlyYearlySwitchOptions,
  monthsYearsInput,
  ongoingInput,
  ongoingPureCalc,
  ongoingSumNums,
  SwitchRelVarbs,
} from "./rel/relVarbs/relOngoingVarbs";
import { switchInput } from "./rel/relVarbs/relSwitchVarbs";
import { RelVarb, RelVarbByType } from "./rel/relVarbTypes";

export type GeneralRelVarbs = Record<string, RelVarb>;
export type RelVarbs<SN extends SectionName> = Record<VarbName<SN>, RelVarb>;

type RelVarbsByType<SN extends SectionName, VLN extends ValueName> = Pick<
  RelVarbs<SN>,
  VarbNameByValueName<SN, VLN>
>;

function isRelVarbOfType<SN extends SectionName, VLN extends ValueName>(
  sectionName: SN,
  varbName: VarbName<SN>,
  valueName: VLN,
  _value: any
): _value is RelVarbByType[VLN] {
  const baseVarbs = baseSectionsVarbs[sectionName];
  const varbType = baseVarbs[varbName] as any as ValueName;
  return varbType === valueName;
}

function filterRelVarbsByType<SN extends SectionName, VLN extends ValueName>(
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

export type SyncStatus = "unsyncedChanges" | "changesSynced";
export type AutoSyncControl = "autoSyncOff" | "autoSyncOn";

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
  get _typeUniformity() {
    return { _typeUniformity: relVarb("string") };
  },
  get savableSection() {
    return {
      displayName: relVarb("stringObj"),
      dateTimeFirstSaved: relVarb("dateTime"),
      dateTimeLastSaved: relVarb("dateTime"),
      syncStatus: relVarb("string", {
        initValue: "unsyncedChanges",
      }),
      autoSyncControl: relVarb("string", {
        initValue: "autoSyncOff" as AutoSyncControl,
      }),
    } as const;
  },
  ongoingPureCalc,
  decimalToPortion,
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
    SN extends SectionName,
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
    SN extends SectionName & ChildName,
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
      ...this._typeUniformity,
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
            updateFnName: "virtualNumObj",
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
      ...this._typeUniformity,
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
            updateFnName: "virtualNumObj",
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
            updateFnName: "virtualNumObj",
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
};
