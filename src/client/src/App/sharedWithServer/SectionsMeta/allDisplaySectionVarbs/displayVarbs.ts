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
  displayVarb,
  DisplayVarb,
  DisplayVarbOptions,
} from "../displaySectionVarbs/displayVarb";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { displayVarbOptions } from "./displayVarb";

type SwitchDisplayVarb<BN extends string, SN extends SwitchName> = Record<
  SwitchVarbName<BN, SN>,
  DisplayVarb
>;

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
  ): SwitchDisplayVarb<BN, SN> {
    const keys = switchKeys(switchName);
    return keys.reduce((varbs, key) => {
      const name = getSwitchVarbName(baseName, switchName, key);
      const fullOptions = switchOptionsToFull(switchName, options);
      varbs[name] = displayVarb(displayName, {
        ...fullOptions.all,
        ...(key === "switch" ? {} : fullOptions.targets),
        ...fullOptions[key],
      });
      return varbs;
    }, {} as SwitchDisplayVarb<BN, SN>);
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
      targets: {
        ...displayVarbOptions.dollars,
        ...options?.targets,
      },
    });
  },
  ongoingDollars<BN extends string>(
    baseName: BN,
    displayName: DisplayName,
    options: SwitchOptions<"ongoing"> = {}
  ): SwitchDisplayVarb<BN, "ongoing"> {
    return this.switch(baseName, "ongoing", displayName, {
      ...options,
      targets: {
        ...displayVarbOptions.dollars,
        ...options?.targets,
      },
    });
  },
  monthsYears<BN extends string>(
    baseName: BN,
    displayName: DisplayName
  ): SwitchDisplayVarb<BN, "monthsYears"> {
    return this.switch(baseName, "monthsYears", displayName);
  },
};

const checkSwitchDisplayVarbProps = <T extends Record<SwitchName, any>>(
  props: T
): T => props;
const switchDisplayVarbProps = checkSwitchDisplayVarbProps({
  ongoing: {
    monthly: displayVarbOptions.monthly,
    yearly: displayVarbOptions.yearly,
  },
  get ongoingInput() {
    return {
      monthly: displayVarbOptions.monthly,
      yearly: displayVarbOptions.yearly,
    };
  },
  monthsYears: {
    months: { endAdornment: "months" },
    years: { endAdornment: "years" },
  },
  percent: { percent: displayVarbOptions.percent },
  get dollarsPercent() {
    return {
      percent: displayVarbOptions.percent,
      dollars: displayVarbOptions.dollars,
    } as const;
  },
  get dollarsPercentDecimal() {
    return {
      percent: displayVarbOptions.percent,
      dollars: displayVarbOptions.dollars,
      decimal: displayVarbOptions.decimal,
    };
  },
} as const);

function switchOptionsToFull<SN extends SwitchName>(
  switchName: SN,
  options: SwitchOptions<SN>
): SwitchOptionsFull<SN> {
  const names = switchOptionNames(switchName);
  const displayProps = switchDisplayVarbProps[switchName];
  return names.reduce((fullOptions, name) => {
    const displayOptions = {
      ...((name as string) in displayProps ? (displayProps as any)[name] : {}),
    };
    const inputOptions = options[name] ?? {};
    fullOptions[name] = {
      ...displayOptions,
      ...inputOptions,
    };
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
