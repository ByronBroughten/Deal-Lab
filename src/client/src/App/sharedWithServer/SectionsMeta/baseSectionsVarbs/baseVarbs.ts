import { Obj } from "../../utils/Obj";
import { Merge, merge } from "./../../utils/Obj/merge";
import {
  GetSwitchOptions,
  getSwitchOptions,
  GetTargetOptions,
  getTargetOptions,
  SwitchKey,
  switchKeyToVarbNames,
  SwitchName,
  switchOptions,
  SwitchOptionsProps,
  SwitchVarbName,
  SwitchVarbNameRecord,
} from "./baseSwitchNames";
import { ValueName, valueNames } from "./ValueName";

const customValueUnits = {
  numObj: ["dollars", "percent", "decimal", "months", "years"],
} as const;

type CustomValueUnits = typeof customValueUnits;
type ValueUnits = {
  [VN in ValueName]: VN extends keyof CustomValueUnits
    ? ["absolute", ...CustomValueUnits[VN]]
    : ["absolute"];
};
const valueUnits = valueNames.reduce((units, valueName) => {
  (units as any)[valueName] =
    valueName in customValueUnits
      ? ["absolute", ...customValueUnits[valueName as keyof CustomValueUnits]]
      : (["absolute"] as ValueUnits[typeof valueName]);
  return units;
}, {} as ValueUnits);

export type ValueUnit<VN extends ValueName = ValueName> =
  ValueUnits[VN][number];

export type ValueTimespan = "oneTime" | "monthly" | "yearly";
export type GeneralBaseVarb = {
  valueName: ValueName;
  valueUnit: ValueUnit;
  valueTimespan: ValueTimespan;
};
function checkBaseVarb<BV extends GeneralBaseVarb>(baseVarb: BV): BV {
  return baseVarb;
}
type DefaultBaseVarb<VN extends ValueName> = {
  valueName: VN;
  valueUnit: ValueUnits[VN][0];
  valueTimespan: "oneTime";
};
function defaultBaseVarb<VN extends ValueName>(
  valueName: VN
): DefaultBaseVarb<VN> {
  return checkBaseVarb({
    valueName,
    valueUnit: valueUnits[valueName][0],
    valueTimespan: "oneTime",
  });
}
type Options = Partial<Omit<GeneralBaseVarb, "valueName">>;
export type BaseVarb<VN extends ValueName, O extends Options = {}> = Merge<
  DefaultBaseVarb<VN>,
  O
>;

export function baseVarb<VN extends ValueName, O extends Options = {}>(
  valueName: VN,
  options?: O
): BaseVarb<VN, O> {
  return merge(defaultBaseVarb(valueName), options ?? ({} as O));
}
export const baseVarbS = {
  dollarsMonthly() {
    return baseVarb("numObj", {
      valueUnit: "dollars",
      valueTimespan: "monthly",
    });
  },
  dollarsYearly() {
    return baseVarb("numObj", {
      valueUnit: "dollars",
      valueTimespan: "yearly",
    });
  },
};

type BaseVarbs<VN extends ValueName, VNS extends string, O extends Options> = {
  [Prop in VNS]: BaseVarb<VN, O>;
};
export function baseVarbs<
  VN extends ValueName,
  VNS extends string,
  O extends Options = {}
>(
  valueName: VN,
  varbNames: readonly VNS[],
  options?: O
): BaseVarbs<VN, VNS, O> {
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = baseVarb(valueName, options ?? ({} as O));
    return varbs;
  }, {} as BaseVarbs<VN, VNS, O>);
}

export type BaseSwitchVarbs<
  BN extends string,
  SN extends SwitchName
> = SwitchVarbNameRecord<BN, SN, BaseVarb<"numObj">, BaseVarb<"string">>;

type BaseSwitchVarbsNext<
  BN extends string,
  SN extends SwitchName,
  O extends SwitchOptionsProps<SN, Options>
> = {
  [SK in SwitchKey<SN> as SwitchVarbName<BN, SN, SK>]: SK extends "switch"
    ? BaseVarb<"string", GetSwitchOptions<SN, SK, O>>
    : BaseVarb<"numObj", GetTargetOptions<SN, SK, O>>;
};

const dollarsValueUnit = { valueUnit: "dollars" } as const;
const percentValueUnit = { valueUnit: "percent" } as const;
const ongoingOptions = {
  monthly: { valueTimespan: "monthly" },
  yearly: { valueTimespan: "yearly" },
} as const;

const ongoingDollarsOptions = {
  targets: { valueUnit: "dollars" },
  ...ongoingOptions,
} as const;
type OngoingDollarsOptions = typeof ongoingDollarsOptions;
const ongoingPercentOptions = {
  targets: { valueUnit: "percent" },
  ...ongoingOptions,
} as const;
type OngoingPercentOptions = typeof ongoingPercentOptions;

const dollarsPercentDecimalOptions = {
  dollars: { valueUnit: "dollars" },
  percent: { valueUnit: "percent" },
  decimal: { valueUnit: "decimal" },
} as const;
type DollarsPercentDecimalOptions = typeof dollarsPercentDecimalOptions;

const monthsYearsOptions = {
  months: { valueUnit: "months" },
  years: { valueUnit: "years" },
} as const;
type MonthsYearsOptions = typeof monthsYearsOptions;

export const baseVarbsS = {
  get typeUniformity() {
    return { _typeUniformity: "string" } as const;
  },
  switch<Base extends string, SN extends SwitchName>(
    baseName: Base,
    switchName: SN
  ): BaseSwitchVarbs<Base, SN> {
    const keyToVarbNames = switchKeyToVarbNames(baseName, switchName);
    return Obj.keys(keyToVarbNames).reduce((varbs, key) => {
      const varbName = keyToVarbNames[key];
      if (key === "switch") {
        varbs[varbName] = baseVarb("string") as BaseSwitchVarbs<
          Base,
          SN
        >[typeof varbName];
      } else {
        varbs[varbName] = baseVarb("numObj") as BaseSwitchVarbs<
          Base,
          SN
        >[typeof varbName];
      }
      return varbs;
    }, {} as BaseSwitchVarbs<Base, SN>);
  },
  group: <
    BN extends string,
    SN extends SwitchName,
    O extends SwitchOptionsProps<SN, Options> = {}
  >(
    baseName: BN,
    switchName: SN,
    options?: O
  ): BaseSwitchVarbsNext<BN, SN, O> => {
    const fullOptions = switchOptions(switchName, options ?? ({} as O));
    const keyToVarbNames = switchKeyToVarbNames(baseName, switchName);
    return Obj.keys(keyToVarbNames).reduce((varbs, key) => {
      const varbName = keyToVarbNames[key];
      if (key === "switch") {
        varbs[varbName] = {
          ...baseVarb("string"),
          ...getSwitchOptions(switchName, key, fullOptions as any),
        } as any as BaseSwitchVarbsNext<BN, SN, O>[typeof varbName];
      } else {
        varbs[varbName] = {
          ...baseVarb("numObj"),
          ...getTargetOptions(switchName, key, fullOptions as any),
        } as any as BaseSwitchVarbsNext<BN, SN, O>[typeof varbName];
      }
      return varbs;
    }, {} as BaseSwitchVarbsNext<BN, SN, O>);
  },
  ongoing<Base extends string>(
    baseName: Base
  ): BaseSwitchVarbs<Base, "ongoing"> {
    return this.group(baseName, "ongoing", ongoingOptions);
  },
  ongoingDecimal<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "ongoing", OngoingDollarsOptions> {
    return this.group(baseName, "ongoing", {
      targets: { valueUnit: "decimal" },
    });
  },
  ongoingDollars<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "ongoing", OngoingDollarsOptions> {
    return this.group(baseName, "ongoing", ongoingDollarsOptions);
  },
  ongoingDollarsInput<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "ongoingInput", OngoingDollarsOptions> {
    return this.group(baseName, "ongoingInput", ongoingDollarsOptions);
  },
  ongoingPercent<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "ongoing", OngoingPercentOptions> {
    return this.group(baseName, "ongoing", ongoingPercentOptions);
  },
  ongoingPercentInput<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "ongoingInput", OngoingPercentOptions> {
    return this.group(baseName, "ongoingInput", ongoingPercentOptions);
  },
  monthsYears<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "monthsYears", MonthsYearsOptions> {
    return this.group(baseName, "monthsYears", monthsYearsOptions);
  },
  monthsYearsInput<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<BN, "monthsYearsInput", MonthsYearsOptions> {
    return this.group(baseName, "monthsYearsInput", monthsYearsOptions);
  },
  dollarsPercentDecimal<BN extends string>(
    baseName: BN
  ): BaseSwitchVarbsNext<
    BN,
    "dollarsPercentDecimal",
    DollarsPercentDecimalOptions
  > {
    return this.group(
      baseName,
      "dollarsPercentDecimal",
      dollarsPercentDecimalOptions
    );
  },
  get switchableEquationEditor() {
    return {
      ...baseVarbs("string", [
        "valueSourceSwitch",
        "displayNameEditor",
      ] as const),
      ...baseVarbs("numObj", ["valueEditor"] as const),
    } as const;
  },
  get savableSection() {
    return {
      displayName: baseVarb("stringObj"),
      dateTimeFirstSaved: baseVarb("dateTime"),
      dateTimeLastSaved: baseVarb("dateTime"),
      autoSyncControl: baseVarb("string"), // autoSyncControl - default to false.
      syncStatus: baseVarb("string"),
    } as const;
  },
  get virtualVarb() {
    return baseVarbs("stringObj", [
      "displayName",
      "displayNameEnd",
      "startAdornment",
      "endAdornment",
    ] as const);
  },
  get singleValueVirtualVarb() {
    return {
      ...this.virtualVarb,
      value: baseVarb("numObj"),
    } as const;
  },
  get loadableVarb() {
    return {
      valueEntityInfo: baseVarb("inEntityInfo"),
    } as const;
  },
} as const;
