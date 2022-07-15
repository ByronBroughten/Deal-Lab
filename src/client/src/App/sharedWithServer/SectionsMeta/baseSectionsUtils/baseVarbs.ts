import { omit } from "lodash";
import { ValueName } from "./baseVarb";
import {
  BaseOngoingVarb,
  BaseSwitchVarb,
  relSwitchVarbs,
  SwitchEndingKey,
  SwitchEndings,
  SwitchRecord,
} from "./RelSwitchVarb";

export type BaseVarbSchemas = { [varbName: string]: ValueName };
type TypeRecord<T extends readonly string[], V extends ValueName> = {
  [Prop in T[number]]: V;
};

export function baseVarbs<V extends ValueName, T extends readonly string[]>(
  vt: V,
  keys: T
): TypeRecord<T, V> {
  return keys.reduce((schemas, key) => {
    schemas[key as T[number]] = vt;
    return schemas;
  }, {} as Partial<TypeRecord<T, V>>) as TypeRecord<T, V>;
}

export const baseVarbsS = {
  switch<Base extends string, SWN extends SwitchEndingKey>(
    baseName: Base,
    switchName: SWN
  ): BaseSwitchVarb<Base, SwitchEndings[SWN]> {
    const { targetEndings, switchEnding } = relSwitchVarbs[switchName];
    type NumObjEndings = Omit<SwitchEndings[SWN], "switch">;
    const numObjSchemas: Partial<
      SwitchRecord<Base, SwitchEndings[SWN], "numObj">
    > = {};
    for (const ending of Object.values(targetEndings)) {
      numObjSchemas[
        `${baseName}${ending}` as keyof SwitchRecord<
          Base,
          SwitchEndings[SWN],
          "numObj"
        >
      ] = "numObj";
    }
    return {
      [`${baseName}${switchEnding}`]: "string",
      ...numObjSchemas,
    } as BaseSwitchVarb<Base, SwitchEndings[SWN]>;
  },
  ongoing<Base extends string>(baseName: Base): BaseOngoingVarb<Base> {
    return this.switch(baseName, "ongoing");
  },
  get savableSection() {
    return {
      title: "string",
      dateTimeFirstSaved: "string",
      dateTimeLastSaved: "string",
    } as const;
  },
  get property() {
    return {
      ...this.savableSection,
      ...baseVarbs("numObj", [
        "price",
        "sqft",
        "numUnits",
        "numBedrooms",
        "upfrontExpenses",
        "upfrontRevenue",
      ] as const),
      ...this.ongoing("taxes"),
      ...this.ongoing("homeIns"),
      ...this.ongoing("ongoingExpenses"),
      ...this.ongoing("targetRent"),
      ...this.ongoing("miscOngoingRevenue"),
      ...this.ongoing("ongoingRevenue"),
    } as const;
  },
  get loan() {
    return {
      ...this.savableSection,
      ...baseVarbs("numObj", [
        "loanAmountDollarsTotal",
        "mortInsUpfront",
        "closingCosts",
        "wrappedInLoan",
      ] as const),
      ...this.ongoing("interestRatePercent"),
      ...this.switch("loanAmountBase", "dollarsPercent"),
      ...this.switch("loanTerm", "monthsYears"),
      ...this.ongoing("pi"),
      ...this.ongoing("mortgageIns"),
    } as const;
  },
  get mgmt() {
    return {
      ...this.savableSection,
      ...baseVarbs("numObj", [
        "vacancyRatePercent",
        "upfrontExpenses",
      ] as const),
      ...this.ongoing("ongoingExpenses"),
      ...this.ongoing("vacancyLossDollars"),
      ...omit(this.switch("rentCut", "dollarsPercent"), ["rentCutDollars"]),
      ...this.ongoing("rentCutDollars"),
    } as const;
  },
  get deal() {
    return {
      ...this.savableSection,
    } as const;
  },
  table: {
    titleFilter: "string",
    rowIds: "stringArray",
  },
  tableRow: {
    title: "string",
    compareToggle: "boolean",
  },
  get feUser() {
    return baseVarbs("string", [
      "email",
      "userName",
      "apiAccessStatus",
    ] as const);
  },
  get singleTimeList() {
    return {
      ...this.savableSection,
      total: "numObj",
      defaultValueSwitch: "string",
    } as const;
  },
  get ongoingList() {
    return {
      ...this.savableSection,
      ...this.ongoing("total"),
      defaultValueSwitch: "string",
      defaultOngoingSwitch: "string",
    } as const;
  },
  get listItem() {
    return {
      displayName: "stringObj",
    } as const;
  },
  get singleVirtualVarb() {
    return {
      ...this.listItem,
      value: "numObj",
    } as const;
  },
} as const;
