import { RelLocalVarbInfo } from "../SectionInfo/RelVarbInfo";

export type DisplayName = string | RelLocalVarbInfo;
export type DisplayOverrideSwitches = readonly DisplayOverrideSwitch[];
interface DisplayOverrideSwitch {
  switchInfo: RelLocalVarbInfo;
  switchValue: string;
  sourceInfo: RelLocalVarbInfo;
}
export type DisplaySourceFinder =
  | null
  | RelLocalVarbInfo
  | DisplayOverrideSwitches;

export type DisplayVarb = {
  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;
  startAdornment: string;
  endAdornment: string;
  displayRound: number;
  calculateRound: number;
  displaySourceFinder: DisplaySourceFinder;
};

const displayVarbCheck = <DS extends DisplayVarb>(value: DS): DS => value;

export function defaultDisplayVarb(displayName: DisplayName) {
  return displayVarbCheck({
    displayName,
    displayNameStart: "",
    displayNameEnd: "",
    startAdornment: "",
    endAdornment: "",
    displayRound: 0,
    calculateRound: 2,
    displaySourceFinder: null,
  });
}

export type DisplayVarbOptions = Partial<DisplayVarb>;
export function displayVarb<DN extends DisplayName>(
  displayName: DN,
  partial: DisplayVarbOptions = {}
): DisplayVarb {
  return {
    ...defaultDisplayVarb(displayName),
    ...partial,
  };
}
