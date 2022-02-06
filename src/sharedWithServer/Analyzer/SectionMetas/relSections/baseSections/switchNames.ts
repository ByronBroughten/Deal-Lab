import { ObjectKeys } from "../../../../utils/Obj";

type NamePlusEndings<
  Base extends string,
  Endings extends Record<string, string>
> = {
  [Prop in keyof Endings]: `${string & Base}${Endings[Prop]}`;
};

export function baseNamePlusEndings<
  Base extends string,
  Endings extends Record<string, string>,
  ToReturn extends NamePlusEndings<Base, Endings>
>(baseName: Base, endings: Endings): ToReturn {
  return ObjectKeys(endings).reduce((names, prop) => {
    names[prop] = `${baseName}${endings[prop]}` as ToReturn[typeof prop];
    return names;
  }, {} as Partial<ToReturn>) as ToReturn;
}

export const switchEndings = {
  dollarsPercent: {
    percent: "Percent",
    dollars: "Dollars",
    switch: "UnitSwitch",
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
export type SwitchEndings = typeof switchEndings;
export type SwitchEndingKey = keyof SwitchEndings;

export function switchNames<Base extends string, K extends keyof SwitchEndings>(
  baseName: Base,
  key: K
): NamePlusEndings<Base, SwitchEndings[K]> {
  return baseNamePlusEndings(baseName, switchEndings[key]);
}

export type SwitchRecord<
  Base extends string,
  Endings extends Record<string, string>,
  Val extends any
> = {
  [Prop in keyof Endings as `${string & Base}${Endings[Prop]}`]: Val;
};

export type SwitchEndingsBase = {
  [key: string]: string;
  switch: string;
};

export type BaseSwitchVarb<
  Base extends string,
  Endings extends SwitchEndingsBase
> = SwitchRecord<Base, Pick<Endings, "switch">, "string"> &
  SwitchRecord<Base, Omit<Endings, "switch">, "numObj">;

export type BaseOngoingVarb<T extends string> = BaseSwitchVarb<
  T,
  typeof switchEndings.ongoing
>;
