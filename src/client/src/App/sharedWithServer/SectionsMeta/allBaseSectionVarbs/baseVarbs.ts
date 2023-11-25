import { Obj } from "../../utils/Obj";
import { merge } from "../../utils/Obj/merge";
import {
  GroupKey,
  groupKeys,
  GroupName,
  GroupRecord,
  GroupRecordAndAll,
  groupVarbName,
  GroupVarbNameBase,
} from "../GroupName";
import { ValueName, valueNames } from "../values/ValueName";
import { baseSectionVarbs } from "./baseSectionVarbs";
import {
  getSwitchOptions,
  getTargetOptions,
  SwitchKey,
  switchKeyToVarbNames,
  SwitchName,
  switchOptions,
  SwitchOptionsProps,
  switchValueName,
  SwitchValueName,
  SwitchVarbName,
} from "./baseSwitchNames";
import { baseOptions } from "./baseUnits";

const dollars = baseOptions.dollars;
const percent = baseOptions.percent;
const decimal = baseOptions.decimal;

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

export type ValueFrequency = "oneTime" | "monthly" | "yearly";
export type GeneralBaseVarb = {
  valueName: ValueName;
  valueUnit: ValueUnit;
  valueFrequency: ValueFrequency;
};
function checkBaseVarb<BV extends GeneralBaseVarb>(baseVarb: BV): BV {
  return baseVarb;
}
type DefaultBaseVarb<VN extends ValueName> = {
  valueName: VN;
  valueUnit: ValueUnits[VN][0];
  valueFrequency: "oneTime";
};

export type BaseVarb<VN extends ValueName> = {
  valueName: VN;
  valueUnit: ValueUnit;
  valueFrequency: ValueFrequency;
};

function defaultBaseVarb<VN extends ValueName>(
  valueName: VN
): DefaultBaseVarb<VN> {
  return checkBaseVarb({
    valueName,
    valueUnit: valueUnits[valueName][0],
    valueFrequency: "oneTime",
  });
}
type Options = Partial<Omit<GeneralBaseVarb, "valueName">>;
type GroupOptions<GN extends GroupName> = Partial<
  GroupRecordAndAll<GN, Options>
>;

export function baseVarb<VN extends ValueName, O extends Options = {}>(
  valueName: VN,
  options?: O
): BaseVarb<VN> {
  return merge(
    defaultBaseVarb(valueName),
    options ?? ({} as O)
  ) as any as BaseVarb<VN>;
}
export const bv = baseVarb;

export const baseVarbS = {
  dollarsMonthly() {
    return baseVarb("numObj", {
      valueUnit: "dollars",
      valueFrequency: "monthly",
    });
  },
  dollarsYearly() {
    return baseVarb("numObj", {
      valueUnit: "dollars",
      valueFrequency: "yearly",
    });
  },
};

type BaseVarbs<VN extends ValueName, VNS extends string> = {
  [Prop in VNS]: BaseVarb<VN>;
};

export function baseVarbs<
  VN extends ValueName,
  VNS extends string,
  O extends Options = {}
>(valueName: VN, varbNames: readonly VNS[], options?: O): BaseVarbs<VN, VNS> {
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = baseVarb(valueName, options ?? ({} as O));
    return varbs;
  }, {} as BaseVarbs<VN, VNS>);
}

type SimpleBaseSwitchVarbs<BN extends string, SN extends SwitchName> = {
  [SK in SwitchKey<SN> as SwitchVarbName<BN, SN, SK>]: SK extends "switch"
    ? BaseVarb<SwitchValueName<SN>>
    : BaseVarb<"numObj">;
};

type BaseVarbGroup<BN extends string, GN extends GroupName> = {
  [GK in GroupKey<GN> as GroupVarbNameBase<BN, GN, GK>]: BaseVarb<"numObj">;
};

const ongoingOptions = {
  monthly: { valueFrequency: "monthly" },
  yearly: { valueFrequency: "yearly" },
} as const;

const ongoingDollarsOptions = {
  targets: { valueUnit: "dollars" },
  ...ongoingOptions,
} as const;

const ongoingPercentOptions = {
  targets: { valueUnit: "percent" },
  ...ongoingOptions,
} as const;

const monthsYearsOptions = {
  months: { valueUnit: "months" },
  years: { valueUnit: "years" },
} as const;

const periodicOptions: GroupRecord<
  "periodic",
  { valueFrequency: ValueFrequency }
> = {
  monthly: { valueFrequency: "monthly" },
  yearly: { valueFrequency: "yearly" },
};
const timespanOptions: GroupRecord<"timespan", { valueUnit: ValueUnit }> = {
  months: { valueUnit: "months" },
  years: { valueUnit: "years" },
};
function allValueUnit(valueUnit: ValueUnit): { all: { valueUnit: ValueUnit } } {
  return { all: { valueUnit } };
}

export const baseVarbsS = {
  get typeUniformity() {
    return { _typeUniformity: "string" } as const;
  },
  groupNext<BN extends string, GN extends GroupName>(
    baseName: BN,
    groupName: GN,
    options?: GroupOptions<GN>
  ): BaseVarbGroup<BN, GN> {
    const keys = groupKeys(groupName);
    return keys.reduce((group, key) => {
      const varbName = groupVarbName(baseName, groupName, key);
      group[varbName] = baseVarb(
        "numObj",
        options && {
          ...options.all,
          ...options[key],
        }
      );
      return group;
    }, {} as BaseVarbGroup<BN, GN>);
  },
  timespan<BN extends string>(
    baseName: BN,
    options?: GroupOptions<"timespan">
  ): BaseVarbGroup<BN, "timespan"> {
    return this.groupNext(baseName, "timespan", {
      all: options?.all,
      months: { ...timespanOptions.months, ...options?.months },
      years: { ...timespanOptions.years, ...options?.years },
    });
  },
  periodic2<BN extends string>(
    baseName: BN,
    options?: GroupOptions<"periodic">
  ): BaseVarbGroup<BN, "periodic"> {
    return this.groupNext(baseName, "periodic", {
      all: options?.all,
      monthly: { ...periodicOptions.monthly, ...options?.monthly },
      yearly: { ...periodicOptions.yearly, ...options?.yearly },
    });
  },
  periodicDollars2<BN extends string>(
    baseName: BN
  ): BaseVarbGroup<BN, "periodic"> {
    return this.periodic2(baseName, allValueUnit("dollars"));
  },
  periodicPercent2<BN extends string>(
    baseName: BN
  ): BaseVarbGroup<BN, "periodic"> {
    return this.periodic2(baseName, allValueUnit("percent"));
  },
  periodicDecimal2<BN extends string>(
    baseName: BN
  ): BaseVarbGroup<BN, "periodic"> {
    return this.periodic2(baseName, allValueUnit("decimal"));
  },

  group: <
    BN extends string,
    SN extends SwitchName,
    O extends SwitchOptionsProps<SN, Options> = {}
  >(
    baseName: BN,
    switchName: SN,
    options?: O
  ): SimpleBaseSwitchVarbs<BN, SN> => {
    const fullOptions = switchOptions(switchName, options ?? ({} as O));
    const keyToVarbNames = switchKeyToVarbNames(baseName, switchName);
    return Obj.keys(keyToVarbNames).reduce((varbs, key) => {
      const varbName = keyToVarbNames[key];
      if (key === "switch") {
        varbs[varbName] = {
          ...baseVarb(switchValueName(switchName)),
          ...getSwitchOptions(switchName, key, fullOptions as any),
        } as any as SimpleBaseSwitchVarbs<BN, SN>[typeof varbName];
      } else {
        varbs[varbName] = {
          ...baseVarb("numObj"),
          ...getTargetOptions(switchName, key, fullOptions as any),
        } as any as SimpleBaseSwitchVarbs<BN, SN>[typeof varbName];
      }
      return varbs;
    }, {} as SimpleBaseSwitchVarbs<BN, SN>);
  },
  periodic<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "periodic"> {
    return this.group(baseName, "periodic");
  },
  periodicDecimal<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "periodic"> {
    return this.group(baseName, "periodic", {
      targets: { valueUnit: "decimal" },
    });
  },
  periodicDollars<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "periodic"> {
    return this.group(baseName, "periodic", ongoingDollarsOptions);
  },
  periodicDollarsInput<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "periodicInput"> {
    return this.group(baseName, "periodicInput", ongoingDollarsOptions);
  },
  periodicPercentInput<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "periodicInput"> {
    return this.group(baseName, "periodicInput", ongoingPercentOptions);
  },

  periodicPercent<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "periodic"> {
    return this.group(baseName, "periodic", ongoingPercentOptions);
  },
  monthsYears<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "monthsYears"> {
    return this.group(baseName, "monthsYears", monthsYearsOptions);
  },
  monthsYearsInput<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "monthsYearsInput"> {
    return this.group(baseName, "monthsYearsInput", monthsYearsOptions);
  },
  get displayName() {
    return {
      displayName: baseVarb("stringObj"),
    } as const;
  },
  get displayNameEditor() {
    return {
      displayNameEditor: baseVarb("string"),
    } as const;
  },
  get displayNameAndEditor() {
    return {
      ...this.displayName,
      ...this.displayNameEditor,
    } as const;
  },
  get savableSection() {
    return {
      displayName: baseVarb("stringObj"),
      dateTimeFirstSaved: baseVarb("dateTime"),
      dateTimeLastSaved: baseVarb("dateTime"),
      autoSyncControl: baseVarb("autoSyncControl"),
    } as const;
  },
  get virtualVarb() {
    return baseVarbs("stringObj", [
      "displayName",
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
      valueEntityInfo: baseVarb("inEntityValue"),
    } as const;
  },
  get loanValue() {
    return baseSectionVarbs({
      valueSourceName: bv("percentDollarsSource"),
      completionStatus: bv("completionStatus"),

      offPercentEditor: bv("numObj", percent), // Down payment percent
      offDollarsEditor: bv("numObj", dollars), // Down payment amount
      amountPercentEditor: bv("numObj", percent), // Loan percent
      amountDollarsEditor: bv("numObj", dollars), //Loan Amount

      offPercent: bv("numObj", percent),
      offDollars: bv("numObj", dollars),
      offDecimal: bv("numObj", decimal),
      amountDollars: bv("numObj", dollars),
      amountPercent: bv("numObj", percent),
      amountDecimal: bv("numObj", decimal),
    });
  },
} as const;

export const bvsS = baseVarbsS;
