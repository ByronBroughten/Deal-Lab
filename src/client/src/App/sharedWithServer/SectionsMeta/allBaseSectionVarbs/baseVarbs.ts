import { Obj } from "../../utils/Obj";
import { Merge, merge } from "../../utils/Obj/merge";
import { ValueName, valueNames } from "../values/ValueName";
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
} from "./baseSwitchNames";

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

export type SimpleBaseVarb<VN extends ValueName> = {
  valueName: VN;
  valueUnit: ValueUnit;
  valueTimespan: ValueTimespan;
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
): SimpleBaseVarb<VN> {
  return merge(
    defaultBaseVarb(valueName),
    options ?? ({} as O)
  ) as any as SimpleBaseVarb<VN>;
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

type SimpleBaseVarbs<VN extends ValueName, VNS extends string> = {
  [Prop in VNS]: SimpleBaseVarb<VN>;
};

export function baseVarbs<
  VN extends ValueName,
  VNS extends string,
  O extends Options = {}
>(
  valueName: VN,
  varbNames: readonly VNS[],
  options?: O
): SimpleBaseVarbs<VN, VNS> {
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = baseVarb(valueName, options ?? ({} as O));
    return varbs;
  }, {} as SimpleBaseVarbs<VN, VNS>);
}

type BaseSwitchVarbs<
  BN extends string,
  SN extends SwitchName,
  O extends SwitchOptionsProps<SN, Options>
> = {
  [SK in SwitchKey<SN> as SwitchVarbName<BN, SN, SK>]: SK extends "switch"
    ? BaseVarb<"string", GetSwitchOptions<SN, SK, O>>
    : BaseVarb<"numObj", GetTargetOptions<SN, SK, O>>;
};

type SimpleBaseSwitchVarbs<BN extends string, SN extends SwitchName> = {
  [SK in SwitchKey<SN> as SwitchVarbName<BN, SN, SK>]: SK extends "switch"
    ? SimpleBaseVarb<"string">
    : SimpleBaseVarb<"numObj">;
};

const ongoingOptions = {
  monthly: { valueTimespan: "monthly" },
  yearly: { valueTimespan: "yearly" },
} as const;
type OngoingOptions = typeof ongoingOptions;

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
          ...baseVarb("string"),
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
  ongoing<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "ongoing"> {
    return this.group(baseName, "ongoing");
  },
  ongoingDecimal<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "ongoing"> {
    return this.group(baseName, "ongoing", {
      targets: { valueUnit: "decimal" },
    });
  },
  ongoingDollars<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "ongoing"> {
    return this.group(baseName, "ongoing", ongoingDollarsOptions);
  },
  ongoingDollarsInput<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "ongoingInput"> {
    return this.group(baseName, "ongoingInput", ongoingDollarsOptions);
  },
  ongoingPercentInput<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "ongoingInput"> {
    return this.group(baseName, "ongoingInput", ongoingPercentOptions);
  },

  ongoingPercent<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "ongoing"> {
    return this.group(baseName, "ongoing", ongoingPercentOptions);
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
  dollarsPercentDecimal<BN extends string>(
    baseName: BN
  ): SimpleBaseSwitchVarbs<BN, "dollarsPercentDecimal"> {
    return this.group(
      baseName,
      "dollarsPercentDecimal",
      dollarsPercentDecimalOptions
    );
  },
  get displayNameAndEditor() {
    return {
      displayName: baseVarb("stringObj"),
      displayNameEditor: baseVarb("string"),
    };
  },
  get switchableEquationEditor() {
    return {
      ...baseVarbs("string", ["valueSourceName", "displayNameEditor"] as const),
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
      valueEntityInfo: baseVarb("inEntityValue"),
    } as const;
  },
} as const;
