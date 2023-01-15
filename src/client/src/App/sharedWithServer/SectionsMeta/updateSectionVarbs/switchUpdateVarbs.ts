import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
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
} from "../baseSectionsVarbs/baseSwitchNames";
import {
  defaultUpdateVarb,
  UpdateVarb,
  updateVarb,
  UpdateVarbOptions,
} from "./updateVarb";
import { updateBasics, updateBasicsS } from "./updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  updateFnPropS,
  UpdateFnProps,
} from "./updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./updateVarb/UpdateOverrides";
import { updateVarbsS } from "./updateVarbs";

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

function switchUpdateVarbs<BN extends string, SN extends SwitchName>(
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

export function ongoingInputNext<BN extends string>(
  baseName: BN,
  {
    switchInit = "monthly",
    ...options
  }: SwitchOptions<"ongoingInput"> & {
    switchInit?: SwitchTargetKey<"ongoingInput">;
  } = {}
): SwitchUpdateVarbs<BN, "ongoingInput"> {
  const names = switchKeyToVarbNames(baseName, "ongoingInput");
  return switchUpdateVarbs(baseName, "ongoingInput", switchInit, {
    ...options,
    editor: { updateFnName: "calcVarbs", ...options.editor },
    monthly: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.activeYearlyToMonthly(baseName),
        updateOverride(
          [overrideSwitchS.monthlyIsActive(baseName)],
          updateBasicsS.loadSolvableTextByVarbInfo(names.editor)
        ),
      ],
      ...options.monthly,
    },
    yearly: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.activeMonthlyToYearly(baseName),
        updateOverride(
          [overrideSwitchS.yearlyIsActive(baseName)],
          updateBasicsS.loadSolvableTextByVarbInfo(names.editor)
        ),
      ],
      ...options.yearly,
    },
  });
}

export const switchUpdateVarbsS = {
  ongoingInputNext,
} as const;

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

export function monthsYearsInput<BN extends string>(
  baseName: BN,
  switchInit: SwitchTargetKey<"monthsYears">,
  options?: SwitchOptions<"monthsYears">
): SwitchUpdateVarbs<BN, "monthsYears"> {
  const varbNames = switchKeyToVarbNames(baseName, "monthsYears");
  return switchUpdateVarbs(baseName, "monthsYears", switchInit, {
    ...options,
    months: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.switchIsActive(baseName, "monthsYears", "years")],
          updateBasics("yearsToMonths", {
            num: updateFnPropS.local(varbNames.years),
          })
        ),
        updateOverride(
          [overrideSwitchS.switchIsActive(baseName, "monthsYears", "months")],
          updateBasics("calcVarbs")
        ),
      ],
      ...options?.months,
    },
    years: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.switchIsActive(baseName, "monthsYears", "months")],
          updateBasics("monthsToYears", {
            num: updateFnPropS.local(varbNames.months),
          })
        ),
        updateOverride(
          [overrideSwitchS.switchIsActive(baseName, "monthsYears", "years")],
          updateBasics("calcVarbs")
        ),
      ],
      ...options?.years,
    },
  });
}

export function ongoingInput<BN extends string>(
  baseName: BN,
  {
    switchInit = "monthly",
    ...options
  }: SwitchOptions<"ongoing"> & { switchInit?: SwitchTargetKey<"ongoing"> } = {}
): SwitchUpdateVarbs<BN, "ongoing"> {
  return switchUpdateVarbs(baseName, "ongoing", switchInit, {
    ...options,
    monthly: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.activeYearlyToMonthly(baseName),
        updateOverride(
          [overrideSwitchS.monthlyIsActive(baseName)],
          updateBasics("calcVarbs")
        ),
      ],
      ...options.monthly,
    },
    yearly: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.activeMonthlyToYearly(baseName),
        updateOverride(
          [overrideSwitchS.yearlyIsActive(baseName)],
          updateBasics("calcVarbs")
        ),
      ],
      ...options.yearly,
    },
  });
}
export function ongoingPureCalc<Base extends string>(
  baseName: Base,
  updatePacks: OngoingUpdatePacks,
  switchInit?: string
): SwitchUpdateVarbs<Base, "ongoing"> {
  const varbNames = switchKeyToVarbNames(baseName, "ongoing");
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
