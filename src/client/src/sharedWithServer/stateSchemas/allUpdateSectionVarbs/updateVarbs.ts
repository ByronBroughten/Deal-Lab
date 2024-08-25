import { GroupVarbNameBase } from "../../sectionVarbsConfigDerived/baseSectionsDerived/baseGroupNames";
import { safeGroupVarbName } from "../../sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import {
  GroupBaseVarbName,
  GroupName,
  GroupRecordAndAll,
  groupKeys,
  groupVarbName,
} from "../GroupName";
import { SafeUpdateOptions, UpdateVarb, updateVarb, uvS } from "./updateVarb";
import { ubS } from "./updateVarb/UpdateBasics";
import { upS, updatePropS } from "./updateVarb/UpdateFnProps";

type GroupOptions<GN extends GroupName> = Partial<
  GroupRecordAndAll<GN, SafeUpdateOptions<"numObj">>
>;

export type GroupUpdateVarbs<
  GN extends GroupName,
  BN extends GroupVarbNameBase<GN>
> = {
  [VN in GroupBaseVarbName<BN, GN>]: UpdateVarb<"numObj">;
};

export const updateVarbsS = {
  groupNext<GN extends GroupName, BN extends GroupVarbNameBase<GN>>(
    groupName: GN,
    baseName: BN,
    options?: GroupOptions<GN>
  ): GroupUpdateVarbs<GN, BN> {
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
    }, {} as GroupUpdateVarbs<GN, BN>);
  },
  periodic2<BN extends GroupVarbNameBase<"periodic">>(
    baseName: BN,
    options?: GroupOptions<"periodic">
  ): GroupUpdateVarbs<"periodic", BN> {
    return this.groupNext("periodic", baseName, options);
  },
  periodicSumNums<BN extends GroupVarbNameBase<"periodic">>(
    baseName: BN,
    {
      localBaseNames = [],
      childBaseNames = [],
    }: {
      localBaseNames?: GroupVarbNameBase<"periodic">[];
      childBaseNames?: [ChildName, GroupVarbNameBase<"periodic">][];
    }
  ): GroupUpdateVarbs<"periodic", BN> {
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
    }, {} as GroupUpdateVarbs<"periodic", BN>);
  },
  loadChildGroup<
    GN extends GroupName,
    BN extends GroupVarbNameBase<GN>,
    CBN extends string
  >(
    groupName: GN,
    baseName: BN,
    childName: ChildName,
    childBaseName: CBN
  ): GroupUpdateVarbs<GN, BN> {
    const keys = groupKeys(groupName);
    const groupOptions = keys.reduce((options, key) => {
      const varbName = safeGroupVarbName(childBaseName, groupName, key);
      options[key] = ubS.loadChild(childName, varbName);
      return options;
    }, {} as GroupOptions<GN>);
    return this.groupNext(groupName, baseName, groupOptions);
  },

  loadChildPeriodic<
    BN extends GroupVarbNameBase<"periodic">,
    CBN extends GroupVarbNameBase<"periodic">
  >(
    baseName: BN,
    childName: ChildName,
    childBaseName: CBN
  ): GroupUpdateVarbs<"periodic", BN> {
    return this.loadChildGroup("periodic", baseName, childName, childBaseName);
  },
  childPeriodicEditor<BN extends GroupVarbNameBase<"periodic">>(
    baseName: BN,
    childName: ChildName
  ) {
    return this.loadChildPeriodic(baseName, childName, "value");
  },
  childTimespanEditor<BN extends GroupVarbNameBase<"timespan">>(
    baseName: BN,
    childName: ChildName
  ) {
    return this.loadChildTimespan(baseName, childName, "value");
  },
  timespan<BN extends GroupVarbNameBase<"timespan">>(
    baseName: BN,
    options?: GroupOptions<"timespan">
  ): GroupUpdateVarbs<"timespan", BN> {
    return this.groupNext("timespan", baseName, options);
  },
  loadChildTimespan<
    BN extends GroupVarbNameBase<"timespan">,
    CBN extends string
  >(baseName: BN, childName: ChildName, childBaseName: CBN) {
    return this.loadChildGroup("timespan", baseName, childName, childBaseName);
  },
  get _typeUniformity() {
    return { _typeUniformity: uvS.manualUpdate("string") };
  },
  get savableSection() {
    return {
      displayName: uvS.manualUpdate("stringObj"),
      dateTimeFirstSaved: uvS.manualUpdate("dateTime"),
      dateTimeLastSaved: uvS.manualUpdate("dateTime"),
      autoSyncControl: uvS.manualUpdate("autoSyncControl", {
        initValue: "autoSyncOff",
      }),
    } as const;
  },
  get displayNameAndEditor(): {
    displayNameEditor: UpdateVarb<"string">;
    displayName: UpdateVarb<"stringObj">;
  } {
    return {
      displayNameEditor: uvS.displayNameEditor,
      displayName: uvS.basic2("stringObj", {
        updateFnName: "localStringToStringObj",
        updateFnProps: {
          localString: updatePropS.local("displayNameEditor"),
        },
      }),
    };
  },
};

export const uvsS = updateVarbsS;
