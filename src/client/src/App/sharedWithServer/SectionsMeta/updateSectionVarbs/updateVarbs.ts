import {
  ongoingPureCalc,
  ongoingSumNums,
  updateGroupS,
} from "./switchUpdateVarbs";
import { UpdateVarb, updateVarb, updateVarbS } from "./updateVarb";
import { updateFnPropS } from "./updateVarb/UpdateFnProps";
import { updateOverrideS } from "./updateVarb/UpdateOverrides";

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
      syncStatus: updateVarb("syncStatus", {
        initValue: "unsyncedChanges",
      }),
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
  get displayNameAndEditor(): {
    displayNameEditor: UpdateVarb<"string">;
    displayName: UpdateVarb<"stringObj">;
  } {
    return {
      displayNameEditor: updateVarbS.displayNameEditor,
      displayName: updateVarb("stringObj", {
        updateFnName: "loadLocalString",
        updateFnProps: {
          localString: updateFnPropS.local("displayNameEditor"),
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
          varbInfo: updateFnPropS.local("valueEntityInfo"),
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
