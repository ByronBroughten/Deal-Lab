import { mixedInfoS } from "../../../StateGetters/Identifiers/MixedSectionInfo";
import { PathNameVarbInfoMixed } from "../../../StateGetters/Identifiers/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../../StateGetters/Identifiers/RelVarbInfo";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../../../StateGetters/Identifiers/sectionPaths/sectionPathNames";
import { isVarbName } from "../../../StateGetters/Identifiers/VarbInfoBase";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
  VarbPathValue,
} from "../../../StateGetters/Identifiers/VarbPathNameInfo";
import { VarbNameWide } from "../../fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { ChildName } from "../../fromSchema6SectionChildren/ChildName";
import { ValueSource } from "../../schema4ValueTraits/StateValue/unionValues";

export type UpdateOverrideSwitches = readonly UpdateOverrideSwitch[];

export interface UpdateOverrideSwitch {
  switchInfo: UpdateOverrideSwitchInfo;
  switchValues: OverrideSwitchValue[];
}

type OverrideSwitchValue = string | boolean;

export type UpdateOverrideSwitchInfo =
  | RelChildrenVarbInfo
  | RelLocalVarbInfo
  | VarbPathNameInfoMixed
  | PathNameVarbInfoMixed;

export function overrideSwitch(
  switchInfo: RelLocalVarbInfo | VarbPathNameInfoMixed | PathNameVarbInfoMixed,
  ...switchValues: OverrideSwitchValue[]
): UpdateOverrideSwitch {
  return {
    switchInfo,
    switchValues,
  };
}

export type StandardSP = UpdateOverrideSwitchInfo | VarbNameWide;
export function standardToOsInfo(
  standard: StandardSP
): UpdateOverrideSwitchInfo {
  return isVarbName(standard) ? relVarbInfoS.local(standard) : standard;
}

export const overrideSwitchS = {
  general(
    switchInfo: StandardSP,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: standardToOsInfo(switchInfo),
      switchValues,
    };
  },
  local(
    varbName: VarbNameWide,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return this.general(varbName, ...switchValues);
  },
  child(
    childName: ChildName,
    varbName: string,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: relVarbInfoS.children(childName, varbName),
      switchValues,
    };
  },

  pathHasValue<PN extends SectionPathName, VN extends SectionPathVarbName<PN>>(
    pathName: PN,
    varbName: VN,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: mixedInfoS.pathNameVarb(pathName, varbName),
      switchValues,
    };
  },
  varbIsValue<VPN extends VarbPathName>(
    varbPathName: VPN,
    ...switchValues: Extract<VarbPathValue<VPN>, OverrideSwitchValue>[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: mixedInfoS.varbPathName(varbPathName),
      switchValues,
    };
  },
  isTrue(prop: StandardSP): UpdateOverrideSwitch {
    return this.general(prop, true);
  },
  isFalse(prop: StandardSP): UpdateOverrideSwitch {
    return this.general(prop, false);
  },
  valueSourceIs(
    valueSource: ValueSource,
    prop?: StandardSP
  ): UpdateOverrideSwitch {
    return this.general(prop ?? "valueSourceName", valueSource);
  },

  childValueSourceIs(childName: ChildName, ...valueSource: ValueSource[]) {
    return this.child(childName, "valueSourceName", ...valueSource);
  },
};

export const osS = overrideSwitchS;
