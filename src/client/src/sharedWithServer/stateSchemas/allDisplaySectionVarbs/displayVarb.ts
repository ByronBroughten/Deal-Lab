import { RelLocalVarbInfo } from "../../StateGetters/Identifiers/RelVarbInfo";

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
  displayNameWithSection: DisplayName;
  displayNameWithVariant: DisplayName;
  displayNameFullContext: DisplayName;

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
    displayNameWithSection: displayName,
    displayNameWithVariant: displayName,
    displayNameFullContext: displayName,
    startAdornment: "",
    endAdornment: "",
    displayRound: 0,
    calculateRound: 2,
    displaySourceFinder: null,
  });
}

export type DisplayVarbOptions = Partial<DisplayVarb>;
export function displayVarb({
  displayName = "",
  ...o
}: DisplayVarbOptions = {}): DisplayVarb {
  const displayNameWithSection = o.displayNameWithSection ?? displayName;
  const displayNameWithVariant = o.displayNameWithVariant ?? displayName;
  const displayNameFullContext =
    o.displayNameFullContext ?? displayNameWithVariant;
  return {
    ...defaultDisplayVarb(displayName),
    ...o,
    displayNameWithSection,
    displayNameWithVariant,
    displayNameFullContext,
  };
}

export function displayVarbOptions(
  displayName: DisplayName,
  options?: DisplayVarbOptions
): DisplayVarbOptions {
  return {
    displayName,
    ...options,
  };
}
