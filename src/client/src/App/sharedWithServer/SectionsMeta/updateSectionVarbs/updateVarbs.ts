import {
  ongoingPureCalc,
  ongoingSumNums,
  updateGroupS,
} from "./switchUpdateVarbs";
import { UpdateVarb, updateVarb, updateVarbS } from "./updateVarb";
import { updatePropS } from "./updateVarb/UpdateFnProps";
import { updateOverrideS } from "./updateVarb/UpdateOverride";

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
      autoSyncControl: updateVarb("autoSyncControl", {
        initValue: "autoSyncOff",
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
          varbInfo: updatePropS.local("valueEntityInfo"),
        },
      }),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "loadStartAdornment",
        updateFnProps: {
          varbInfo: updatePropS.local("valueEntityInfo"),
        },
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "loadEndAdornment",
        updateFnProps: {
          varbInfo: updatePropS.local("valueEntityInfo"),
        },
      }),
    } as const;
  },
  get displayNameAndEditor(): {
    displayNameEditor: UpdateVarb<"string">;
    displayName: UpdateVarb<"stringObj">;
  } {
    return {
      displayNameEditor: updateVarbS.displayNameEditor,
      displayName: updateVarb("stringObj", {
        updateFnName: "localStringToStringObj",
        updateFnProps: {
          localString: updatePropS.local("displayNameEditor"),
        },
      }),
    };
  },
  get virtualVarb() {
    return {
      valueEntityInfo: updateVarb("inEntityValue"),
      value: updateVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: updatePropS.local("valueEntityInfo"),
        },
      }),
      displayName: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayName")],
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
};

export const uvsS = updateVarbsS;
