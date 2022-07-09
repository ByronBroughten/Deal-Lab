import { omit } from "lodash";
import { GeneralBaseVarb, ValueName } from "./baseVarb";
import {
  BaseOngoingVarb,
  BaseSwitchVarb,
  switchEndings,
  SwitchEndingsBase,
  SwitchRecord,
} from "./switchNames";

type GeneralBaseVarbs = { [varbName: string]: GeneralBaseVarb };

export type BaseVarbSchemas = { [varbName: string]: ValueName };
type TypeRecord<T extends readonly string[], V extends ValueName> = {
  [Prop in T[number]]: V;
};

export const baseVarbs = {
  type<T extends readonly string[], V extends ValueName>(
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
      ...this.savableSection,
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
      ...this.savableSection,
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
    return this.string(["email", "userName", "apiAccessStatus"] as const);
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
  get varbInfo() {
    return this.string(["id", "infoType", "sectionName", "varbName"] as const);
  },
  get entityInfo() {
    return {
      ...this.varbInfo,
      entityId: "string",
    } as const;
  },
} as const;
