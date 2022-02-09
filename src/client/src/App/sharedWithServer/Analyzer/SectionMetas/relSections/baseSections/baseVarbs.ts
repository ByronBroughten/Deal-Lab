import { omit } from "lodash";
import { BaseValueTypeName } from "./baseVarb";
import {
  BaseOngoingVarb,
  BaseSwitchVarb,
  switchEndings,
  SwitchEndingsBase,
  SwitchRecord,
} from "./switchNames";

export type BaseVarbSchemas = { [varbName: string]: BaseValueTypeName };
type TypeRecord<T extends readonly string[], V extends BaseValueTypeName> = {
  [Prop in T[number]]: V;
};

export const baseVarbs = {
  type<T extends readonly string[], V extends BaseValueTypeName>(
    keys: T,
    vt: V
  ): TypeRecord<T, V> {
    return keys.reduce((schemas, key) => {
      schemas[key as T[number]] = vt;
      return schemas;
    }, {} as Partial<TypeRecord<T, V>>) as TypeRecord<T, V>;
  },
  string<T extends readonly string[]>(keys: T): TypeRecord<T, "string"> {
    return this.type(keys, "string");
  },
  numObj<T extends readonly string[]>(keys: T): TypeRecord<T, "numObj"> {
    return this.type(keys, "numObj");
  },
  switch<Base extends string, Endings extends SwitchEndingsBase>(
    baseName: Base,
    endings: Endings
  ) {
    type NumObjEndings = Omit<Endings, "switch">;
    const numObjEndings = omit(endings, ["switch"]);
    const numObjSchemas: Partial<SwitchRecord<Base, NumObjEndings, "numObj">> =
      {};
    for (const ending of Object.values(numObjEndings)) {
      numObjSchemas[
        `${baseName}${ending}` as keyof SwitchRecord<
          Base,
          NumObjEndings,
          "numObj"
        >
      ] = "numObj";
    }
    return {
      [`${baseName}${endings.switch}`]: "string",
      ...numObjSchemas,
    } as BaseSwitchVarb<Base, Endings>;
  },
  ongoing<Base extends string>(baseName: Base): BaseOngoingVarb<Base> {
    return this.switch(baseName, switchEndings.ongoing);
  },
  get property() {
    return {
      title: "string",
      ...this.numObj([
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
      title: "string",
      ...this.numObj([
        "loanAmountDollarsTotal",
        "mortInsUpfront",
        "closingCosts",
        "wrappedInLoan",
      ] as const),
      ...this.ongoing("interestRatePercent"),
      ...this.switch("loanAmountBase", switchEndings.dollarsPercent),
      ...this.switch("loanTerm", switchEndings.monthsYears),
      ...this.ongoing("pi"),
      ...this.ongoing("mortgageIns"),
    } as const;
  },
  get mgmt() {
    return {
      title: "string",
      ...this.numObj(["vacancyRatePercent", "upfrontExpenses"] as const),
      ...this.ongoing("ongoingExpenses"),
      ...this.ongoing("vacancyLossDollars"),
      ...this.switch(
        "rentCut",
        omit(switchEndings.dollarsPercent, ["dollars"])
      ),
      ...this.ongoing("rentCutDollars"),
    } as const;
  },
  get analysis() {
    return {
      title: "string",
    } as const;
  },
  table: {
    searchFilter: "string",
    rowIds: "stringArray",
  },
  tableRow: {
    title: "string",
    compareToggle: "boolean",
  },
  get singleTimeList() {
    return {
      total: "numObj",
      title: "string",
      defaultValueSwitch: "string",
    } as const;
  },
  get ongoingList() {
    return {
      title: "string",
      ...this.ongoing("total"),
      defaultValueSwitch: "string",
    } as const;
  },
  get varbInfo() {
    return this.string(["id", "idType", "sectionName", "varbName"] as const);
  },
  get entityInfo() {
    return {
      ...this.varbInfo,
      entityId: "string",
    } as const;
  },
} as const;
