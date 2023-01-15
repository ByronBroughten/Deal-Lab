import { Arr } from "../../utils/Arr";
import {
  getSwitchVarbName,
  switchKeys,
  switchKeyToVarbNames,
  SwitchName,
  SwitchOptionName,
  switchOptionNames,
  switchTargetKeys,
  SwitchVarbName,
} from "../baseSectionsVarbs/baseSwitchNames";
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

export const displayVarbsS = {
  switch<BN extends string, SN extends SwitchName>(
    baseName: BN,
    switchName: SN,
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
  },
  ongoingInputDollars<BN extends string>(
    baseName: BN,
    displayName: DisplayName,
    options: SwitchOptions<"ongoingInput"> = {}
  ) {
    return this.switch(baseName, "ongoingInput", displayName, {
      ...options,
      editor: {
        displaySourceFinder: editorDisplaySourceSwitches(
          baseName,
          "ongoingInput"
        ),
        ...options?.editor,
      },
    });
  },
  ongoingDollars<BN extends string>(
    baseName: BN,
    displayName: DisplayName,
    options: SwitchOptions<"ongoing"> = {}
  ): SwitchDisplayVarbOptions<BN, "ongoing"> {
    return this.switch(baseName, "ongoing", displayName, options);
  },
  monthsYears<BN extends string>(
    baseName: BN,
    displayName: DisplayName
  ): SwitchDisplayVarbOptions<BN, "monthsYears"> {
    return this.switch(baseName, "monthsYears", displayName);
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
  SN extends "ongoingInput"
>(baseName: BN, switchName: SN): DisplayOverrideSwitches {
  const names = switchKeyToVarbNames(baseName, switchName);
  const targetKeys = Arr.exclude(switchTargetKeys(switchName), [
    "editor",
  ] as const);
  return targetKeys.map((targetKey) => ({
    switchInfo: relVarbInfoS.local(names.switch),
    switchValue: targetKey as string,
    sourceInfo: relVarbInfoS.local(names[targetKey]),
  }));
}
