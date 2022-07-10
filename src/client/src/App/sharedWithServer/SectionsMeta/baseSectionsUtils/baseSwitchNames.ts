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
type BaseSwitchSchemas = typeof baseSwitchSchemas;

export type SwitchName = keyof BaseSwitchSchemas;
export type SwitchTargetKey<SW extends SwitchName> = Exclude<
  SwitchKey<SW>,
  "switch"
>;
type SwitchKey<SW extends SwitchName> = keyof BaseSwitchSchemas[SW];

export type SwitchVarbName<
  BN extends string,
  SW extends SwitchName,
  SK extends SwitchKey<SW>
> = keyof {
  [Prop in SK as `${BN}${BaseSwitchSchemas[SW][Prop] & string}`]: any;
};
