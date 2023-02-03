import { switchKeyToVarbNames } from "../allBaseSectionVarbs/baseSwitchNames";
import { AutoSyncControl } from "../baseSectionsDerived/subValues";
import {
  ongoingPureCalc,
  ongoingSumNums,
  updateGroupS,
} from "./switchUpdateVarbs";
import { UpdateSectionVarbs } from "./updateSectionVarbs";
import { updateVarb, updateVarbS } from "./updateVarb";
import { updateBasics, updateBasicsS } from "./updateVarb/UpdateBasics";
import { updateFnPropS } from "./updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./updateVarb/UpdateOverrides";

export const updateVarbsS = {
  ...updateGroupS,
  get _typeUniformity() {
    return { _typeUniformity: updateVarb("string") };
  },
  get savableSection() {
    return {
      displayName: updateVarb("stringObj"),
      dateTimeFirstSaved: updateVarb("dateTime"),
      dateTimeLastSaved: updateVarb("dateTime"),
      syncStatus: updateVarb("string", {
        initValue: "unsyncedChanges",
      }),
      autoSyncControl: updateVarb("string", {
        initValue: "autoSyncOff" as AutoSyncControl,
      }),
    } as const;
  },
  ongoingPureCalc,
  ongoingSumNums,
  get basicVirtualVarb() {
    return {
      displayName: updateVarb("stringObj", {
        updateFnName: "loadDisplayName",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      displayNameEnd: updateVarb("stringObj", {
        updateFnName: "loadDisplayNameEnd",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "loadStartAdornment",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "loadEndAdornment",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
    } as const;
  },
  get listItemVirtualVarb() {
    return {
      valueEntityInfo: updateVarb("inEntityInfo"),
      displayNameEditor: updateVarbS.displayNameEditor,
      displayName: updateVarb("stringObj", {
        updateFnName: "loadLocalString",
        updateFnProps: {
          loadLocalString: updateFnPropS.local("displayNameEditor"),
          valueSourceSwitch: updateFnPropS.local("valueSourceSwitch"),
        },
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayName")],
      }),
      displayNameEnd: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayNameEnd")],
      }),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadStartAdornment")],
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadEndAdornment")],
      }),
    } as const;
  },
  singleTimeItem(): UpdateSectionVarbs<"singleTimeItem"> {
    return {
      ...this._typeUniformity,
      ...this.listItemVirtualVarb,
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("valueSourceSwitch", "labeledEquation")],
            updateBasicsS.loadFromLocalValueEditor()
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceSwitch", "loadedVarb")],
            updateBasics("virtualNumObj", {
              varbInfo: updateFnPropS.local("valueEntityInfo"),
            })
          ),
        ],
      }),
      valueSourceSwitch: updateVarb("string", { initValue: "labeledEquation" }),
      valueEditor: updateVarb("numObj"),
    };
  },
  ongoingItem(): UpdateSectionVarbs<"ongoingItem"> {
    const valueNameBase = "value";
    const ongoingValueNames = switchKeyToVarbNames(valueNameBase, "ongoing");
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
      valueSourceSwitch: updateVarb("string", {
        initValue: "labeledEquation",
      }),
      costToReplace: updateVarb("numObj"),
      valueEditor: updateVarb("numObj"),
      ...updateVarbsS.monthsYearsInput("lifespan", "years"),
      [ongoingValueNames.switch]: updateVarb("string", {
        initValue: "monthly",
      }),
      [ongoingValueNames.monthly]: updateVarb("numObj", {
        ...makeDefaultValueUpdatePack(),
        updateOverrides: [
          updateOverrideS.activeYearlyToMonthly(valueNameBase),
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
      }),
      [ongoingValueNames.yearly]: updateVarb("numObj", {
        ...makeDefaultValueUpdatePack(),
        updateOverrides: [
          updateOverrideS.activeMonthlyToYearly(valueNameBase),
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
      }),
    };
  },
};
