import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { Merge, Spread } from "../../utils/Obj/merge";
import { StrictExtract } from "../../utils/types";

type GeneralBaseSwitchSchemas = {
  [key: string]: {
    [key: string]: string;
    switch: string;
  };
};
export const switchVarbNameEndings = {
  percent: {
    percent: "Percent",
    switch: "UnitSwitch",
  },
  get dollarsPercent() {
    return {
      ...this.percent,
      dollars: "Dollars",
    } as const;
  },
  get dollarsPercentDecimal() {
    return {
      ...this.dollarsPercent,
      decimal: "Decimal",
    } as const;
  },
  get ongoingInput() {
    return {
      ...this.ongoing,
      editor: "OngoingEditor",
    } as const;
  },
  get monthsYearsInput() {
    return {
      ...this.monthsYears,
      editor: "SpanEditor",
    } as const;
  },
  ongoing: {
    monthly: "Monthly",
    yearly: "Yearly",
    switch: "OngoingSwitch",
  },
  monthsYears: {
    months: "Months",
    years: "Years",
    switch: "SpanSwitch",
  },
} as const;
const _testBaseSwitchSchemas = <BSS extends GeneralBaseSwitchSchemas>(_: BSS) =>
  undefined;
_testBaseSwitchSchemas(switchVarbNameEndings);
type SwitchVarbNameEndings = typeof switchVarbNameEndings;

export type SwitchKey<SN extends SwitchName> = keyof SwitchVarbNameEndings[SN];
export function switchKeys<SN extends SwitchName>(
  switchName: SN
): SwitchKey<SN>[] {
  return Obj.keys(switchVarbNameEndings[switchName]);
}

export type SwitchName = keyof SwitchVarbNameEndings;
export type EditorSwitchName = StrictExtract<
  SwitchName,
  "ongoingInput" | "monthsYearsInput"
>;
export type SwitchTargetKey<SW extends SwitchName> = Exclude<
  SwitchKey<SW>,
  "switch"
>;
export function switchTargetKeys<SW extends SwitchName>(
  switchName: SW
): SwitchTargetKey<SW>[] {
  return Arr.exclude(switchKeys(switchName), ["switch"]);
}

type TargetNames<BN extends string, SN extends SwitchName> = keyof {
  [SK in SwitchTargetKey<SN> as SwitchVarbName<BN, SN, SK>]: any;
};

export function targetNames<BN extends string, SN extends SwitchName>(
  baseName: BN,
  switchName: SN
): TargetNames<BN, SN>[] {
  const keyToVarbNames = switchKeyToVarbNames(baseName, switchName);
  const targetKeys = switchTargetKeys(switchName);
  return targetKeys.map((targetKey) => keyToVarbNames[targetKey]);
}

export type SwitchVarbName<
  BN extends string,
  SN extends SwitchName,
  SK extends SwitchKey<SN> = SwitchKey<SN>
> = keyof {
  [S in SK as `${BN}${SwitchVarbNameEndings[SN][S] & string}`]: any;
};
export function getSwitchVarbName<
  BN extends string,
  SN extends SwitchName,
  SK extends SwitchKey<SN> = SwitchKey<SN>
>(baseName: BN, switchName: SN, switchKey: SK): SwitchVarbName<BN, SN, SK> {
  return `${baseName}${switchVarbNameEndings[switchName][switchKey]}` as SwitchVarbName<
    BN,
    SN,
    SK
  >;
}

type SwitchKeyToVarbNames<BN extends string, SN extends SwitchName> = {
  [SK in SwitchKey<SN>]: SwitchVarbName<BN, SN, SK>;
};
export function switchKeyToVarbNames<BN extends string, SN extends SwitchName>(
  baseName: BN,
  switchName: SN
): SwitchKeyToVarbNames<BN, SN> {
  const endings = switchVarbNameEndings[switchName];
  return Obj.keys(endings).reduce((keyToVarbNames, key) => {
    keyToVarbNames[key] = `${baseName}${endings[key]}` as SwitchVarbName<
      BN,
      SN,
      typeof key
    >;
    return keyToVarbNames;
  }, {} as SwitchKeyToVarbNames<BN, SN>);
}

export type SwitchVarbNameRecord<
  BN extends string,
  SN extends SwitchName,
  TargetVal extends any,
  SwitchVal extends any = TargetVal
> = {
  [K in SwitchKey<SN> as SwitchVarbName<BN, SN, K>]: K extends "switch"
    ? SwitchVal
    : TargetVal;
};

const extraSwitchOptionNames = ["targets", "all"] as const;
type ExtraSwitchOptionName = typeof extraSwitchOptionNames[number];
export type SwitchOptionName<SN extends SwitchName> =
  | SwitchKey<SN>
  | ExtraSwitchOptionName;
export function switchOptionNames<SN extends SwitchName>(
  switchName: SN
): SwitchOptionName<SN>[] {
  return [...switchKeys(switchName), ...extraSwitchOptionNames];
}

export type SwitchOptionsFull<SN extends SwitchName, O extends any> = Record<
  SwitchOptionName<SN>,
  O
>;

export type SwitchOptionsProps<SN extends SwitchName, O extends any> = Partial<
  SwitchOptionsFull<SN, O>
>;

export type GetTargetOptions<
  SN extends SwitchName,
  SK extends SwitchKey<SN>,
  O extends SwitchOptionsFull<SN, any>
> = Spread<[O["all"], O["targets"], O[SK]]>;
export function getTargetOptions<
  SN extends SwitchName,
  SK extends SwitchKey<SN>,
  O extends SwitchOptionsFull<SN, any>
>(_: SN, switchKey: SK, options: O): GetTargetOptions<SN, SK, O> {
  return Obj.spread(
    options["all"],
    options["targets"],
    options[switchKey]
  ) as any;
}

export type GetSwitchOptions<
  SN extends SwitchName,
  SK extends SwitchKey<SN>,
  O extends SwitchOptionsFull<SN, any>
> = Spread<[O["all"], O[SK]]>;
export function getSwitchOptions<
  SN extends SwitchName,
  SK extends SwitchKey<SN>,
  O extends SwitchOptionsFull<SN, any>
>(_: SN, switchKey: SK, options: O): GetSwitchOptions<SN, SK, O> {
  return Obj.spread(options["all"], options[switchKey]);
}

type DefaultSwitchOptions<SN extends SwitchName> = Record<
  SwitchOptionName<SN>,
  {}
>;
function defaultSwitchOptions<SN extends SwitchName>(
  switchName: SN
): DefaultSwitchOptions<SN> {
  return switchOptionNames(switchName).reduce((defaults, optionName) => {
    defaults[optionName] = {};
    return defaults;
  }, {} as DefaultSwitchOptions<SN>);
}

export type SwitchOptions<
  SN extends SwitchName,
  SO extends SwitchOptionsProps<SN, any>
> = Merge<DefaultSwitchOptions<SN>, SO>;
export function switchOptions<
  SN extends SwitchName,
  SO extends SwitchOptionsProps<SN, any>
>(switchName: SN, options: SO): SwitchOptions<SN, SO> {
  return Obj.merge(defaultSwitchOptions(switchName), options);
}
