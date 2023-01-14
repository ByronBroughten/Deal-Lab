import {
  VarbName,
  VarbValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { AutoSyncControl } from "../baseSectionsDerived/subValues";
import { switchKeyToVarbNames } from "../baseSectionsVarbs/baseSwitchNames";
import { SectionName } from "../SectionName";
import {
  GeneralUpdateVarb,
  relVarbS,
  UpdateVarb,
  updateVarb,
} from "./rel/updateVarb";
import { updateBasics, updateBasicsS } from "./rel/updateVarb/UpdateBasics";
import { updateFnPropS } from "./rel/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./rel/updateVarb/UpdateOverrides";
import {
  monthsYearsInput,
  ongoingInput,
  ongoingPureCalc,
  ongoingSumNums,
} from "./rel/updateVarbs/switchUpdateVarbs";

export type GeneralUpdateSectionVarbs = Record<string, GeneralUpdateVarb>;
export type UpdateSectionVarbs<SN extends SectionName> = {
  [VN in VarbName<SN>]: UpdateVarb<VarbValueName<SN, VN>>;
};

export const updateVarbsS = {
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
  ongoingInput,
  monthsYearsInput,
  ongoingInputNext<BN extends string>(baseName: BN) {},
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
      displayNameEditor: relVarbS.displayNameEditor,
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
      ...updateVarbsS.monthsYearsInput("lifespan", { switchInit: "years" }),
      [ongoingValueNames.switch]: updateVarb("string", {
        initValue: "monthly",
      }),
      [ongoingValueNames.monthly]: updateVarb("numObj", {
        ...makeDefaultValueUpdatePack(),
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
      }),
      [ongoingValueNames.yearly]: updateVarb("numObj", {
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
      }),
    };
  },
};
