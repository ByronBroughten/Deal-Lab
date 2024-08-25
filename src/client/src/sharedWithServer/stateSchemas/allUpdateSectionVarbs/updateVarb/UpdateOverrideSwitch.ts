import { mixedInfoS } from "../../../SectionInfos/MixedSectionInfo";
import { PathNameVarbInfoMixed } from "../../../SectionInfos/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../../SectionInfos/RelVarbInfo";
import { isVarbName } from "../../../SectionInfos/VarbInfoBase";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
  VarbPathValue,
} from "../../../SectionInfos/VarbPathNameInfo";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../../../sectionPaths/sectionPathNames";
import { VarbNameWide } from "../../derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { ChildName } from "../../derivedFromChildrenSchemas/ChildName";
import { ValueSource } from "../../StateValue/unionValues";

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
