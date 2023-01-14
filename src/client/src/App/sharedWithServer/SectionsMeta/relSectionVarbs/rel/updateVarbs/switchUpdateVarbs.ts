import { Arr } from "../../../../utils/Arr";
import { Obj } from "../../../../utils/Obj";
import {
  getSwitchVarbName,
  SwitchKey,
  switchKeys,
  switchKeyToVarbNames,
  SwitchName,
  SwitchOptionName,
  switchOptionNames,
  SwitchTargetKey,
  switchTargetKeys,
  SwitchVarbNameRecord,
} from "../../../baseSectionsVarbs/baseSwitchNames";
import { updateVarbsS } from "../../updateVarbs";
import {
  defaultUpdateVarb,
  UpdateVarb,
  updateVarb,
  UpdateVarbOptions,
} from "../updateVarb";
import {
  UpdateFnProp,
  updateFnPropS,
  UpdateFnProps,
} from "../updateVarb/UpdateFnProps";
import { switchUpdateVarbs } from "./switchUpdateVarbsDepreciated";

export type SwitchUpdateVarbs<
  BN extends string,
  SN extends SwitchName
> = SwitchVarbNameRecord<BN, SN, UpdateVarb<"numObj">, UpdateVarb<"string">>;

type UpdateOptionName<SN extends SwitchName> = Exclude<
  SwitchOptionName<SN>,
  "all"
>;
function updateOptionNames<SN extends SwitchName>(
  switchName: SN
): UpdateOptionName<SN>[] {
  return Arr.exclude(switchOptionNames(switchName), ["all"] as const);
}

type SwitchOptionsFull<SN extends SwitchName> = {
  [SON in UpdateOptionName<SN>]: SON extends "switch"
    ? UpdateVarbOptions<"string">
    : UpdateVarbOptions<"numObj">;
};
type SwitchOptions<SN extends SwitchName> = Partial<SwitchOptionsFull<SN>>;

function switchOptionsToFull<SN extends SwitchName>(
  switchOptions: SwitchOptions<SN>,
  switchName: SN
): SwitchOptionsFull<SN> {
  const names = updateOptionNames(switchName);
  return names.reduce((full, name) => {
    full[name] = (switchOptions[name] ??
      {}) as SwitchOptionsFull<SN>[keyof SwitchOptionsFull<SN>];
    return full;
  }, {} as SwitchOptionsFull<SN>);
}

function switchUpdateVarbsNext<BN extends string, SN extends SwitchName>(
  baseName: BN,
  switchName: SN,
  switchInit: string,
  options: SwitchOptions<SN>
): SwitchUpdateVarbs<BN, SN> {
  const fullOptions = switchOptionsToFull(options, switchName);
  const keys = switchKeys(switchName);
  return keys.reduce((varbs, key) => {
    const varbName = getSwitchVarbName(baseName, switchName, key);
    if (key === "switch") {
      (varbs as any)[varbName] = {
        ...defaultUpdateVarb("string"),
        ...fullOptions[key as "switch"],
        initValue: switchInit,
      };
    } else {
      (varbs as any)[varbName] = {
        ...defaultUpdateVarb("numObj"),
        ...fullOptions.targets,
        ...fullOptions[key as keyof typeof fullOptions],
      };
    }
    return varbs;
  }, {} as SwitchUpdateVarbs<BN, SN>);
}

export type MonthlyYearlySwitchOptions = {
  monthly?: UpdateVarbOptions<"numObj">;
  yearly?: UpdateVarbOptions<"numObj">;
  shared?: UpdateVarbOptions<"numObj">;
  switchInit?: "monthly" | "yearly";
};

type MonthsYearsOptions = {
  months?: UpdateVarbOptions<"numObj">;
  years?: UpdateVarbOptions<"numObj">;
  shared?: UpdateVarbOptions<"numObj">;
};
type MonthsYearsSwitchOptions = MonthsYearsOptions & {
  switchInit?: "months" | "years";
};

function switchEndingToUpdateProp<
  SN extends SwitchName,
  SK extends SwitchKey<SN>
>(info: UpdateFnProp, switchName: SN, switchKey: SK) {
  return {
    ...info,
    varbName: getSwitchVarbName(info.varbName, switchName, switchKey),
  };
}

function switchEndingsToUpdateProps<
  SN extends SwitchName,
  SK extends SwitchKey<SN>
>(
  props: UpdateFnProp | UpdateFnProp[],
  switchName: SN,
  switchKey: SK
): UpdateFnProp | UpdateFnProp[] {
  if (Array.isArray(props)) {
    return props.map((prop) =>
      switchEndingToUpdateProp(prop, switchName, switchKey)
    );
  } else {
    return switchEndingToUpdateProp(props, switchName, switchKey);
  }
}

type SwitchUpdateFnProps<SN extends SwitchName> = Record<
  SwitchTargetKey<SN>,
  UpdateFnProps
>;
function getSwitchUpdateFnProps<SN extends SwitchName>(
  updateFnProps: UpdateFnProps,
  switchName: SN
): SwitchUpdateFnProps<SN> {
  const targetKeys = switchTargetKeys(switchName);
  return targetKeys.reduce((switchUpdateProps, switchKey) => {
    switchUpdateProps[switchKey] = {};
    for (const propName of Obj.keys(updateFnProps)) {
      const props = updateFnProps[propName];
      (switchUpdateProps as any)[switchKey][propName] =
        switchEndingsToUpdateProps(props, switchName, switchKey);
    }
    return switchUpdateProps;
  }, {} as SwitchUpdateFnProps<SN>);
}

type OngoingUpdatePacks = {
  monthly: UpdateVarbOptions<"numObj">;
  yearly: UpdateVarbOptions<"numObj">;
};

export function monthsYearsInput<Base extends string>(
  baseVarbName: Base,
  { switchInit = "months", ...options }: MonthsYearsSwitchOptions = {}
): SwitchUpdateVarbs<Base, "monthsYears"> {
  const varbNames = switchKeyToVarbNames(baseVarbName, "monthsYears");
  return switchUpdateVarbs(
    baseVarbName,
    "monthsYears",
    [
      {
        updateFnName: "yearsToMonths",
        updateFnProps: {
          num: updateFnPropS.local(varbNames.years),
        },
        switchValue: "months",
        options: {
          ...options.shared,
          ...options.months,
        },
      },
      {
        updateFnName: "monthsToYears",
        updateFnProps: {
          num: updateFnPropS.local(varbNames.months),
        },
        switchValue: "years",
        options: {
          ...options.shared,
          ...options.years,
        },
      },
    ],
    switchInit
  );
}
export function ongoingInput<Base extends string>(
  baseVarbName: Base,
  { switchInit = "monthly", ...options }: MonthlyYearlySwitchOptions = {}
): SwitchUpdateVarbs<Base, "ongoing"> {
  const varbNames = switchKeyToVarbNames(baseVarbName, "ongoing");
  return switchUpdateVarbs(
    baseVarbName,
    "ongoing",
    [
      {
        updateFnName: "yearlyToMonthly",
        updateFnProps: {
          num: updateFnPropS.local(varbNames.yearly),
        },
        switchValue: "monthly",
        options: {
          ...options.monthly,
          ...options.shared,
        },
      },
      {
        updateFnName: "monthlyToYearly",
        updateFnProps: {
          num: updateFnPropS.local(varbNames.monthly),
        },
        switchValue: "yearly",
        options: {
          ...options.yearly,
          ...options.shared,
        },
      },
    ],
    switchInit
  );
}
export function ongoingPureCalc<Base extends string>(
  baseVarbName: Base,
  updatePacks: OngoingUpdatePacks,
  switchInit?: string
): SwitchUpdateVarbs<Base, "ongoing"> {
  const varbNames = switchKeyToVarbNames(baseVarbName, "ongoing");
  return {
    [varbNames.monthly]: updateVarb("numObj", updatePacks.monthly),
    [varbNames.yearly]: updateVarb("numObj", updatePacks.yearly),
    ...(switchInit && {
      [varbNames.switch]: updateVarb("string", {
        initValue: switchInit,
      }),
    }),
  };
}
export function ongoingSumNums<Base extends string>(
  varbNameBase: Base,
  updateFnArrProp: UpdateFnProp[],
  switchInit: SwitchTargetKey<"ongoing"> = "monthly"
): SwitchUpdateVarbs<Base, "ongoing"> {
  const props = getSwitchUpdateFnProps({ nums: updateFnArrProp }, "ongoing");
  return updateVarbsS.ongoingPureCalc(
    varbNameBase,
    {
      monthly: {
        updateFnName: "sumNums",
        updateFnProps: props.monthly,
      },
      yearly: {
        updateFnName: "sumNums",
        updateFnProps: props.yearly,
      },
    },
    switchInit
  );
}
