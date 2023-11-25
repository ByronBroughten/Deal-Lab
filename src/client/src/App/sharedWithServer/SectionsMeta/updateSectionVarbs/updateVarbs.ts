import { safeGroupVarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import {
  groupKeys,
  GroupName,
  GroupRecordAndAll,
  groupVarbName,
  GroupVarbNameBase,
} from "../GroupName";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import {
  ongoingPureCalc,
  ongoingSumNums,
  updateGroupS,
} from "./switchUpdateVarbs";
import {
  SafeUpdateOptions,
  UpdateVarb,
  updateVarb,
  updateVarbS,
  uvS,
} from "./updateVarb";
import { ubS } from "./updateVarb/UpdateBasics";
import { updatePropS, upS } from "./updateVarb/UpdateFnProps";
import { updateOverrideS } from "./updateVarb/UpdateOverride";

type GroupOptions<GN extends GroupName> = Partial<
  GroupRecordAndAll<GN, SafeUpdateOptions<"numObj">>
>;

export type GroupUpdateVarbs<BN extends string, GN extends GroupName> = {
  [VN in GroupVarbNameBase<BN, GN>]: UpdateVarb<"numObj">;
};

export const updateVarbsS = {
  ...updateGroupS,
  groupNext<BN extends string, GN extends GroupName>(
    baseName: BN,
    groupName: GN,
    options?: GroupOptions<GN>
  ): GroupUpdateVarbs<BN, GN> {
    const keys = groupKeys(groupName);
    return keys.reduce((varbs, key) => {
      const varbName = groupVarbName(baseName, groupName, key);
      varbs[varbName] = updateVarb(
        "numObj",
        options && {
          updateFnName: "throwIfReached",
          ...options.all,
          ...options[key],
        }
      );
      return varbs;
    }, {} as GroupUpdateVarbs<BN, GN>);
  },
  periodic2<BN extends string>(
    baseName: BN,
    options?: GroupOptions<"periodic">
  ): GroupUpdateVarbs<BN, "periodic"> {
    return this.groupNext(baseName, "periodic", options);
  },
  periodicSumNums<BN extends string>(
    baseName: BN,
    {
      localBaseNames = [],
      childBaseNames = [],
    }: { localBaseNames?: string[]; childBaseNames?: [ChildName, string][] }
  ): GroupUpdateVarbs<BN, "periodic"> {
    const keys = groupKeys("periodic");
    return keys.reduce((varbs, key) => {
      const varbName = groupVarbName(baseName, "periodic", key);
      const localNames = localBaseNames.map((base) =>
        safeGroupVarbName(base, "periodic", key)
      );
      const childInfos = childBaseNames.map(([childName, base]) =>
        upS.children(childName, safeGroupVarbName(base, "periodic", key))
      );
      varbs[varbName] = uvS.sumNums([...localNames, ...childInfos]);
      return varbs;
    }, {} as GroupUpdateVarbs<BN, "periodic">);
  },
  loadChildGroup<BN extends string, GN extends GroupName, CBN extends string>(
    baseName: BN,
    groupName: GN,
    childName: ChildName,
    childBaseName: CBN
  ): GroupUpdateVarbs<BN, GN> {
    const keys = groupKeys(groupName);
    const groupOptions = keys.reduce((options, key) => {
      const varbName = safeGroupVarbName(childBaseName, groupName, key);
      options[key] = ubS.loadChild(childName, varbName);
      return options;
    }, {} as GroupOptions<GN>);
    return this.groupNext(baseName, groupName, groupOptions);
  },

  loadChildPeriodic<BN extends string, CBN extends string>(
    baseName: BN,
    childName: ChildName,
    childBaseName: CBN
  ): GroupUpdateVarbs<BN, "periodic"> {
    return this.loadChildGroup(baseName, "periodic", childName, childBaseName);
  },
  childPeriodicEditor<BN extends string>(baseName: BN, childName: ChildName) {
    return this.loadChildPeriodic(baseName, childName, "value");
  },
  timespan<BN extends string>(
    baseName: BN,
    options?: GroupOptions<"timespan">
  ): GroupUpdateVarbs<BN, "timespan"> {
    return this.groupNext(baseName, "timespan", options);
  },
  loadChildTimespan<BN extends string, CBN extends string>(
    baseName: BN,
    childName: ChildName,
    childBaseName: CBN
  ) {
    return this.loadChildGroup(baseName, "timespan", childName, childBaseName);
  },
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
