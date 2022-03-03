import { Obj } from "../../../../utils/Obj";
import { BaseVarb } from "./baseVarb";

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
function switchKeyArr<SW extends SwitchName>(switchName: SW): SwitchKey<SW>[] {
  return Obj.keys(baseSwitchSchemas[switchName]);
}

type SwitchTargetKey<SW extends SwitchName> = Exclude<SwitchKey<SW>, "switch">;
type BaseSwitchVarbName<
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
  return `${baseName}${baseSwitchSchemas[switchName][switchKey]}` as BaseSwitchVarbName<
    BN,
    SW,
    SK
  >;
}
type BaseSwitchVarbNames<BN extends string, SW extends SwitchName> = {
  [SK in SwitchKey<SW>]: BaseSwitchVarbName<BN, SW, SK>;
};

export function switchVarbNames<BN extends string, SW extends SwitchName>(
  baseName: BN,
  switchName: SW
) {
  const switchKeys = Obj.keys(baseSwitchSchemas[switchName]);
  return switchKeys.reduce((targets, key) => {
    targets[key] = baseSwitchVarbName(baseName, switchName, key);
    return targets;
  }, {} as any) as BaseSwitchVarbNames<BN, SW>;
}

export type BaseTargetVarb<BN extends string, SW extends SwitchName> = BaseVarb<
  BN,
  "numObj",
  { switchName: SW }
>;
type BaseSwitchVarb<BN extends string, SW extends SwitchName> = BaseVarb<
  BN,
  "string",
  {
    switchName: SW;
    selectable: false;
  }
>;
export type BaseSwitchTargetVarbs<BN extends string, SW extends SwitchName> = {
  [Prop in SwitchTargetKey<SW> as BaseSwitchVarbName<
    BN,
    SW,
    Prop
  >]: BaseTargetVarb<BN, SW>;
};

export type BaseSwitchVarbs<
  BN extends string,
  SW extends SwitchName
> = BaseSwitchTargetVarbs<BN, SW> & {
  [Prop in "switch" as BaseSwitchVarbName<BN, SW, Prop>]: BaseSwitchVarb<
    BN,
    SW
  >;
};

export const baseSwitch = {
  schemas: baseSwitchSchemas,
  nameArr: Obj.keys(baseSwitchSchemas),
  varbName: baseSwitchVarbName,
  keyArr: switchKeyArr,
};
