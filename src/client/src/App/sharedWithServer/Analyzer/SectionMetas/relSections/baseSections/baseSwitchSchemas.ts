import { Obj } from "../../../../utils/Obj";
import { BaseName, isVarbName, VarbName } from "../BaseName";
import { BaseVarb } from "./baseVarb";

type GeneralBaseSwitchSchemas = {
  [key: string]: {
    [key: string]: string;
    switch: string;
  };
};

export const baseSwitchSchemas = {
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

export const baseSwitch = {
  schemas: baseSwitchSchemas,
  nameArr: Obj.keys(baseSwitchSchemas),
};

export type BaseSwitchSchemas = typeof baseSwitchSchemas;

const _switchEndingsTest = <
  Props extends Record<string, GeneralBaseSwitchSchemas>
>(
  _: Props
) => undefined;
_switchEndingsTest(baseSwitchSchemas);

export type SwitchName = keyof BaseSwitchSchemas;
export type SwitchKey<SW extends SwitchName> = keyof BaseSwitchSchemas[SW];
type SwitchTargetKey<SW extends SwitchName> = Exclude<SwitchKey<SW>, "switch">;
type BaseSwitchTargets<SW extends SwitchName> = Pick<
  BaseSwitchSchemas[SW],
  SwitchTargetKey<SW>
>;

type SwitchVarbName<
  BN extends string,
  SW extends SwitchName,
  SK extends SwitchKey<SW>
> = keyof {
  [Prop in SK as `${BN}${BaseSwitchSchemas[SW][Prop] & string}`]: any;
};
export function switchVarbName<
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
type SwitchVarbNames<BN extends string, SW extends SwitchName> = {
  [SK in SwitchKey<SW>]: SwitchVarbName<BN, SW, SK>;
};

export function switchVarbNames<BN extends string, SW extends SwitchName>(
  baseName: BN,
  switchName: SW
) {
  const switchKeys = Obj.keys(baseSwitchSchemas[switchName]);
  return switchKeys.reduce((targets, key) => {
    targets[key] = switchVarbName(baseName, switchName, key);
    return targets;
  }, {} as any) as SwitchVarbNames<BN, SW>;
}

// obsolete soon
type SwitchNames<SW extends SwitchName, SN extends BaseName> = Record<
  SwitchKey<SW>,
  VarbName<SN>
>;
export function isSwitchVarbNames<SW extends SwitchName, SN extends BaseName>(
  sectionName: SN,
  endingName: SW,
  value: any
): value is SwitchNames<SW, SN> {
  const endingKeys = Object.keys(baseSwitchSchemas[endingName]);
  for (const [key, val] of Object.entries(value)) {
    if (!endingKeys.includes(key)) return false;
    if (!isVarbName(sectionName, val)) return false;
  }
  return true;
}

export type BaseTargetVarb<BN extends string, SW extends SwitchName> = BaseVarb<
  BN,
  "numObj",
  { switchName: SW }
>;
export type BaseSwitchVarb<BN extends string, SW extends SwitchName> = BaseVarb<
  BN,
  "string",
  {
    switchName: SW;
    selectable: false;
  }
>;

export type BaseSwitchTargetVarbs<BN extends string, SW extends SwitchName> = {
  [Prop in SwitchTargetKey<SW> as SwitchVarbName<BN, SW, Prop>]: BaseTargetVarb<
    BN,
    SW
  >;
};

export type BaseSwitchVarbs<
  BN extends string,
  SW extends SwitchName
> = BaseSwitchTargetVarbs<BN, SW> & {
  [Prop in "switch" as SwitchVarbName<BN, SW, Prop>]: BaseSwitchVarb<BN, SW>;
};
