import { Obj } from "../../../../utils/Obj";
import { BaseValueName } from "./baseValues";
import {
  baseVarb,
  BaseVarb,
  GeneralBaseVarb,
  BaseVarbOptions,
} from "./baseVarb";
import {
  SwitchName,
  baseSwitchSchemas,
  BaseTargetVarb,
  BaseSwitchVarbs,
  switchVarbName,
  BaseSwitchTargetVarbs,
} from "./baseSwitchSchemas";

export type GeneralBaseVarbs = { [varbName: string]: GeneralBaseVarb };
type DefaultBaseVarbs<
  VNS extends readonly string[],
  T extends BaseValueName
> = {
  [BN in VNS[number]]: BaseVarb<BN, T>;
};

export const baseVarbs = {
  // Oh, I'll use the singular varbs, still

  // ok, so in singular cases, the baseName is the same as the
  // extensions.
  type<
    BN extends string,
    VN extends BaseValueName,
    O extends BaseVarbOptions = {}
  >(baseName: BN, valueName: VN, options?: O) {
    return {
      [baseName]: baseVarb.type(baseName, valueName, options),
    } as Record<BN, BaseVarb<BN, VN, O>>;
  },
  numObj<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ) {
    return this.type(baseName, "numObj", options);
  },
  string<BN extends string, O extends BaseVarbOptions = {}>(
    baseName: BN,
    options?: O
  ) {
    return this.type(baseName, "string", options);
  },
  title() {
    return this.string("title" as "title");
  },
  defaults<V extends readonly string[], T extends BaseValueName>(
    varbNames: V,
    typeName: T
  ) {
    return varbNames.reduce((bVarbs, varbName) => {
      bVarbs[varbName as V[number]] = baseVarb.default(varbName, typeName);
      return bVarbs;
    }, {} as DefaultBaseVarbs<V, T>);
  },
  defaultString<V extends readonly string[]>(
    varbNames: V
  ): DefaultBaseVarbs<V, "string"> {
    return this.defaults(varbNames, "string");
  },
  defaultNumObj<V extends readonly string[]>(
    varbNames: V
  ): DefaultBaseVarbs<V, "numObj"> {
    return this.defaults(varbNames, "numObj");
  },
  switch<BN extends string, SW extends SwitchName>(
    baseName: BN,
    switchName: SW
  ) {
    const numObjSchemas: Partial<BaseSwitchTargetVarbs<BN, SW>> = {};
    for (const switchKey of Obj.keys(baseSwitchSchemas[switchName])) {
      if (switchKey === "switch") continue;
      const target: BaseTargetVarb<BN, SW> = baseVarb.numObj(baseName, {
        switchName,
      });
      numObjSchemas[
        switchVarbName(
          baseName,
          switchName,
          switchKey
        ) as keyof typeof numObjSchemas
      ] = target;
    }
    return {
      [switchVarbName(baseName, switchName, "switch")]: baseVarb.string(
        baseName,
        {
          switchName,
          selectable: false,
        }
      ),
      ...numObjSchemas,
    } as BaseSwitchVarbs<BN, SW>;
  },
  ongoing<BN extends string>(baseName: BN) {
    return this.switch(baseName, "ongoing");
  },
  get property() {
    return {
      ...this.title(),
      ...this.defaultNumObj([
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
      ...this.title(),
      ...this.defaultNumObj([
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
      ...this.title(),
      ...this.defaultNumObj(["vacancyRatePercent", "upfrontExpenses"] as const),
      ...this.ongoing("ongoingExpenses"),
      ...this.ongoing("vacancyLossDollars"),
      ...this.switch("rentCut", "percent"),
      ...this.ongoing("rentCutDollars"),
    } as const;
  },
  get analysis() {
    return {
      ...this.title(),
    } as const;
  },
  get table() {
    return {
      ...this.string("searchFilter"),
      ...this.type("rowIds", "stringArray"),
    };
  },
  get tableRow() {
    return {
      ...this.title(),
      ...this.type("compareToggle", "boolean"),
    };
  },
  get tableRowInfo() {
    return {
      ...this.title(),
      ...this.type("compareToggle", "boolean"),
    };
  },
  get singleTimeList() {
    return {
      ...this.numObj("total"),
      ...this.title(),
      ...this.string("defaultValueSwitch"),
    } as const;
  },
  get ongoingList() {
    return {
      ...this.title(),
      ...this.ongoing("total"),
      ...this.string("defaultValueSwitch"),
    } as const;
  },
  get varbInfo() {
    return this.defaultString([
      "id",
      "idType",
      "sectionName",
      "varbName",
    ] as const);
  },
  get entityInfo() {
    return {
      ...this.varbInfo,
      ...this.string("entityId"),
    } as const;
  },
} as const;

function _baseVarbsTest(
  _baseVarbs: Record<
    string,
    GeneralBaseVarbs | ((...args: any[]) => GeneralBaseVarbs)
  >
): void {
  const title = baseVarbs.string("title");
  const _title: "title" = title.title.baseName;
  const _null: null = title.title.switchName;
  //@ts-expect-error
  const _fail: "ongoing" = title.title.switchName;

  const test = baseVarbs.numObj("test", { switchName: "ongoing" });
  const _baseName: "test" = test.test.baseName;
  // @ts-expect-error
  const _toFail: undefined = test.test;

  const _loanAmountBase: "loanAmountBase" =
    baseVarbs.loan.loanAmountBasePercent.baseName;
  // @ts-expect-error
  const _notLoanAmountBase: "not" =
    baseVarbs.loan.loanAmountBasePercent.baseName;
}

_baseVarbsTest(baseVarbs);
