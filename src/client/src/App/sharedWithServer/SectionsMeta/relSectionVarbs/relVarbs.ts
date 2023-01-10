import { Obj } from "../../utils/Obj";
import { baseSectionsVarbs } from "../allBaseSectionVarbs";
import {
  VarbName,
  VarbNameByValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { ValueName } from "../baseSectionsVarbs/baseVarbDepreciated";
import { switchNames } from "../baseSectionsVarbs/RelSwitchVarb";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { SectionName } from "../SectionName";
import { relVarb, relVarbS } from "./rel/relVarb";
import { updateBasics, updateBasicsS } from "./rel/relVarb/UpdateBasics";
import { updateFnPropS } from "./rel/relVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./rel/relVarb/UpdateOverrides";
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
import { RelVarb } from "./rel/relVarbTypes";

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
): _value is RelVarb<VLN> {
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
  RelVarb<"string">
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
          [updateFnPropS.children(sectionName, varbName)],
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
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      displayNameEnd: relVarb("stringObj", {
        updateFnName: "loadDisplayNameEnd",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      startAdornment: relVarb("stringObj", {
        updateFnName: "loadStartAdornment",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      endAdornment: relVarb("stringObj", {
        updateFnName: "loadEndAdornment",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
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
          loadLocalString: updateFnPropS.local("displayNameEditor"),
          valueSourceSwitch: updateFnPropS.local("valueSourceSwitch"),
        },
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayName")],
      }),
      displayNameEnd: relVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayNameEnd")],
      }),
      startAdornment: relVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadStartAdornment")],
      }),
      endAdornment: relVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadEndAdornment")],
      }),
    } as const;
  },
  singleTimeItem(): RelVarbs<"singleTimeItem"> {
    return {
      ...this._typeUniformity,
      ...this.listItemVirtualVarb,
      value: relVarbS.numObj(relVarbInfoS.local("displayName"), {
        startAdornment: "$",
        unit: "decimal",
        ...updateBasicsS.loadFromLocalValueEditor(),
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("valueSourceSwitch", "loadedVarb")],
            updateBasics("virtualNumObj", {
              varbInfo: updateFnPropS.local("valueEntityInfo"),
            })
          ),
        ],
      }),
      valueSourceSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      valueEditor: relVarbS.calcVarb("", { startAdornment: "$" }),
    };
  },
  ongoingItem(): RelVarbs<"ongoingItem"> {
    const valueNameBase = "value";
    const ongoingValueNames = switchNames(valueNameBase, "ongoing");
    const makeDefaultValueUpdatePack = () =>
      ({
        updateFnName: "loadSolvableTextByVarbInfo",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEditor"),
          switch: updateFnPropS.local("valueSourceSwitch"),
        },
      } as const);
    return {
      ...this._typeUniformity,
      ...this.listItemVirtualVarb,
      valueSourceSwitch: relVarb("string", {
        initValue: "labeledEquation",
      }),
      costToReplace: relVarbS.calcVarb("Replacement cost", {
        startAdornment: "$",
      }),
      valueEditor: relVarbS.calcVarb("", {
        startAdornment: "$",
        endAdornment: "provide adornment to editor",
      }),
      ...relVarbsS.monthsYearsInput("lifespan", "Average lifespan", {
        switchInit: "years",
      }),
      [ongoingValueNames.switch]: relVarb("string", {
        initValue: "monthly",
      }),
      [ongoingValueNames.monthly]: relVarbS.moneyMonth("Monthly amount", {
        ...makeDefaultValueUpdatePack(),
        // this could be clearer if it were linked to the switches
        // and I used an error updateFn
        updateOverrides: [
          updateOverrideS.yearlyIfActive(valueNameBase),
          updateOverride(
            [
              overrideSwitchS.monthlyIsActive(valueNameBase),
              overrideSwitchS.local("valueSourceSwitch", "loadedVarb"),
            ],
            updateBasics("virtualNumObj", {
              varbInfo: updateFnPropS.local("valueEntityInfo"),
            })
          ),
          updateOverride(
            [
              overrideSwitchS.monthlyIsActive(valueNameBase),
              overrideSwitchS.local("valueSourceSwitch", "labeledSpanOverCost"),
            ],
            updateBasics("simpleDivide", {
              leftSide: updateFnPropS.local("costToReplace"),
              rightSide: updateFnPropS.local("lifespanMonths"),
            })
          ),
        ],
        unit: "decimal",
      }),
      [ongoingValueNames.yearly]: relVarbS.moneyYear("Annual amount", {
        ...makeDefaultValueUpdatePack(),
        updateOverrides: [
          updateOverrideS.monthlyIfActive(valueNameBase),
          updateOverride(
            [
              overrideSwitchS.yearlyIsActive(valueNameBase),
              overrideSwitchS.local("valueSourceSwitch", "loadedVarb"),
            ],
            updateBasics("virtualNumObj", {
              varbInfo: updateFnPropS.local("valueEntityInfo"),
            })
          ),
          updateOverride(
            [
              overrideSwitchS.yearlyIsActive(valueNameBase),
              overrideSwitchS.local("valueSourceSwitch", "labeledSpanOverCost"),
            ],
            updateBasics("simpleDivide", {
              leftSide: updateFnPropS.local("costToReplace"),
              rightSide: updateFnPropS.local("lifespanMonths"),
            })
          ),
        ],
        unit: "decimal",
      }),
    };
  },
};
