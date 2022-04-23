import Arr from "../../utils/Arr";
import { Obj } from "../../utils/Obj";

type GeneralBaseSwitchSchemas = {
  [key: string]: {
    [key: string]: string;
    switch: string;
  };
};
const baseSwitchSchemas = {
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
_testBaseSwitchSchemas(baseSwitchSchemas);
export type BaseSwitchSchemas = typeof baseSwitchSchemas;

export type SwitchName = keyof BaseSwitchSchemas;
export type SwitchKey<SW extends SwitchName> = keyof BaseSwitchSchemas[SW];
export type SwitchTargetKey<SW extends SwitchName> = Exclude<
  SwitchKey<SW>,
  "switch"
>;

export type SwitchVarbName<
  BN extends string,
  SW extends SwitchName,
  SK extends SwitchKey<SW>
> = keyof {
  [Prop in SK as `${BN}${BaseSwitchSchemas[SW][Prop] & string}`]: any;
};
function baseSwitchVarbName<
  BN extends string,
  SW extends SwitchName,
  SK extends SwitchKey<SW>
>(baseName: BN, switchName: SW, switchKey: SK) {
  return `${baseName}${baseSwitchSchemas[switchName][switchKey]}` as SwitchVarbName<
    BN,
    SW,
    SK
  >;
}
export type SwitchVarbNames<BN extends string, SW extends SwitchName> = {
  [SK in SwitchKey<SW>]: SwitchVarbName<BN, SW, SK>;
};
export type BaseSwitchTargetVarbNames<
  BN extends string,
  SW extends SwitchName
> = {
  [SK in SwitchTargetKey<SW>]: SwitchVarbName<BN, SW, SK>;
};

export function switchVarbNames<BN extends string, SW extends SwitchName>(
  baseName: BN,
  switchName: SW
) {
  const switchKeys = Obj.keys(baseSwitchSchemas[switchName]);
  return switchKeys.reduce((targets, key) => {
    targets[key] = baseSwitchVarbName(baseName, switchName, key);
    return targets;
  }, {} as any) as SwitchVarbNames<BN, SW>;
}

export const switchName = {
  schemas: baseSwitchSchemas,
  nameArr: Obj.keys(baseSwitchSchemas),
  varbName: baseSwitchVarbName,
  varbNames: switchVarbNames,
  keyArr<SW extends SwitchName>(switchName: SW): SwitchKey<SW>[] {
    return Obj.keys(baseSwitchSchemas[switchName]);
  },
  targetKeyArr<SW extends SwitchName>(switchName: SW) {
    const keyArr = this.keyArr(switchName);
    return Arr.exclude(keyArr, ["switch"] as const) as SwitchTargetKey<SW>[];
  },
};
