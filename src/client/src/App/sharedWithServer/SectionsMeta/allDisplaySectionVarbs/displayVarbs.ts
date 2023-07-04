import { Arr } from "../../utils/Arr";
import {
  EditorSwitchName,
  getSwitchVarbName,
  switchKeys,
  switchKeyToVarbNames,
  SwitchName,
  SwitchOptionName,
  switchOptionNames,
  switchTargetKeys,
  SwitchVarbName,
} from "../allBaseSectionVarbs/baseSwitchNames";
import {
  DisplayName,
  DisplayOverrideSwitches,
  DisplayVarbOptions,
} from "../displaySectionVarbs/displayVarb";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";

type SwitchDisplayVarbOptions<
  BN extends string,
  SN extends SwitchName
> = Record<SwitchVarbName<BN, SN>, DisplayVarbOptions>;

type SwitchOptionsFull<SN extends SwitchName> = Record<
  SwitchOptionName<SN>,
  DisplayVarbOptions
>;

type SwitchOptions<SN extends SwitchName> = Partial<SwitchOptionsFull<SN>>;

export function displayGroup<BN extends string, SN extends SwitchName>(
  switchName: SN,
  baseName: BN,
  displayName: DisplayName,
  options: SwitchOptions<SN> = {}
): SwitchDisplayVarbOptions<BN, SN> {
  const keys = switchKeys(switchName);
  return keys.reduce((varbs, key) => {
    const name = getSwitchVarbName(baseName, switchName, key);
    const fullOptions = switchOptionsToFull(switchName, options);
    varbs[name] = {
      displayName,
      ...fullOptions.all,
      ...(key === "switch" ? {} : fullOptions.targets),
      ...fullOptions[key],
    };
    return varbs;
  }, {} as SwitchDisplayVarbOptions<BN, SN>);
}
export function editorDisplayGroup<
  BN extends string,
  SN extends EditorSwitchName
>(
  switchName: SN,
  baseName: BN,
  displayName: DisplayName,
  options: SwitchOptions<SN> = {}
): SwitchDisplayVarbOptions<BN, SN> {
  return displayGroup(switchName, baseName, displayName, {
    ...options,
    editor: {
      displaySourceFinder: editorDisplaySourceSwitches(baseName, switchName),
      ...options?.editor,
    },
  });
}

export const displayVarbsS = {
  group: displayGroup,
  editorGroup: editorDisplayGroup,
  ongoingInputDollars<BN extends string>(
    baseName: BN,
    displayName: DisplayName,
    options: SwitchOptions<"periodicInput"> = {}
  ): SwitchDisplayVarbOptions<BN, "periodicInput"> {
    return this.editorGroup("periodicInput", baseName, displayName, options);
  },
  ongoingDollars<BN extends string>(
    baseName: BN,
    displayName: DisplayName,
    options: SwitchOptions<"periodic"> = {}
  ): SwitchDisplayVarbOptions<BN, "periodic"> {
    return this.group("periodic", baseName, displayName, options);
  },
  monthsYears<BN extends string>(
    baseName: BN,
    displayName: DisplayName
  ): SwitchDisplayVarbOptions<BN, "monthsYears"> {
    return this.group("monthsYears", baseName, displayName);
  },
};

function switchOptionsToFull<SN extends SwitchName>(
  switchName: SN,
  options: SwitchOptions<SN>
): SwitchOptionsFull<SN> {
  const names = switchOptionNames(switchName);
  return names.reduce((fullOptions, name) => {
    fullOptions[name] = options[name] ?? {};
    return fullOptions;
  }, {} as SwitchOptionsFull<SN>);
}

function editorDisplaySourceSwitches<
  BN extends string,
  SN extends EditorSwitchName
>(baseName: BN, switchName: SN): DisplayOverrideSwitches {
  const names = switchKeyToVarbNames(baseName, switchName);
  const targetKeys = Arr.exclude(switchTargetKeys(switchName), [
    "editor",
  ] as const);
  return targetKeys.map((targetKey) => ({
    switchInfo: relVarbInfoS.localBase(names.switch),
    switchValue: targetKey as string,
    sourceInfo: relVarbInfoS.localBase(names[targetKey]),
  }));
}
