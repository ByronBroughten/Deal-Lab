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
  switchValueName,
  SwitchValueName,
  SwitchVarbNameRecord,
} from "../allBaseSectionVarbs/baseSwitchNames";
import { validateAnyVarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { VarbPathName } from "../SectionInfo/VarbPathNameInfo";
import { StateValue } from "../values/StateValue";
import { UpdateVarb, updateVarb, UpdateVarbOptions } from "./updateVarb";
import {
  UpdateBasics,
  updateBasics,
  updateBasicsS,
} from "./updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  updateFnPropS,
  UpdateFnProps,
} from "./updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
  UpdateOverrideSwitches,
} from "./updateVarb/UpdateOverrides";
import { updateVarbsS } from "./updateVarbs";

export type UpdateGroup<
  BN extends string,
  SN extends SwitchName
> = SwitchVarbNameRecord<
  BN,
  SN,
  UpdateVarb<"numObj">,
  UpdateVarb<SwitchValueName<SN>>
>;

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
    ? UpdateVarbOptions<SwitchValueName<SN>>
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

function updateGroup<BN extends string, SN extends SwitchName>(
  baseName: BN,
  switchName: SN,
  switchInit: StateValue<SwitchValueName<SN>>,
  options: SwitchOptions<SN>
): UpdateGroup<BN, SN> {
  const fullOptions = switchOptionsToFull(options, switchName);
  const keys = switchKeys(switchName);
  return keys.reduce((varbs, key) => {
    const varbName = getSwitchVarbName(baseName, switchName, key);
    if (key === "switch") {
      (varbs as any)[varbName] = updateVarb(switchValueName(switchName), {
        ...fullOptions[key as "switch"],
        initValue: switchInit,
      });
    } else {
      (varbs as any)[varbName] = updateVarb("numObj", {
        ...fullOptions.targets,
        ...fullOptions[key as keyof typeof fullOptions],
      });
    }
    return varbs;
  }, {} as UpdateGroup<BN, SN>);
}

export function periodicInput<BN extends string>(
  baseName: BN,
  {
    switchInit = "monthly",
    ...options
  }: SwitchOptions<"periodicInput"> & {
    switchInit?: StateValue<SwitchValueName<"periodicInput">>;
  } = {}
): UpdateGroup<BN, "periodicInput"> {
  const names = switchKeyToVarbNames(baseName, "periodicInput");
  return updateGroup(baseName, "periodicInput", switchInit, {
    ...options,
    editor: { updateFnName: "calcVarbs", ...options.editor },
    monthly: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.activeYearlyToMonthly(baseName),
        updateOverride(
          [overrideSwitchS.monthlyIsActive(baseName)],
          updateBasicsS.loadSolvableTextByVarbInfo(
            validateAnyVarbName(names.editor)
          )
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
          updateBasicsS.loadSolvableTextByVarbInfo(
            validateAnyVarbName(names.editor)
          )
        ),
      ],
      ...options.yearly,
    },
  });
}

type OngoingSumNumProps = {
  updateBasics?: UpdateBasics<"numObj">;
  updateFnProps?: UpdateFnProp[];
  updateOverrides?: {
    switches: UpdateOverrideSwitches;
    updateBasics?: UpdateBasics<"numObj">;
    updateFnProps?: UpdateFnProp[];
  }[];
};

export const updateGroupS = {
  group: updateGroup,
  periodicInput,
  monthsYearsInput,
  ongoingSumNumsNext<BN extends string>(
    baseName: BN,
    initSwitch: SwitchTargetKey<"periodic">,
    {
      updateBasics: updateFnBasics,
      updateFnProps = [],
      updateOverrides = [],
    }: OngoingSumNumProps
  ): UpdateGroup<BN, "periodic"> {
    const targetKeys = switchTargetKeys("periodic");
    const options = targetKeys.reduce((options, key) => {
      options[key] = {
        updateFnName: "sumNums",
        updateFnProps: {
          nums: updatePropsPlusGroupEnding(updateFnProps, "periodic", key),
        },
        ...updateFnBasics,
        updateOverrides: [
          ...updateOverrides.map((override) => {
            return updateOverride(
              override.switches,
              override.updateBasics ??
                updateBasics("sumNums", {
                  nums: updatePropsPlusGroupEnding(
                    override.updateFnProps ?? [],
                    "periodic",
                    key
                  ),
                })
            );
          }),
        ],
      };
      return options;
    }, {} as SwitchOptions<"periodic">);
    return updateGroup(baseName, "periodic", initSwitch, options);
  },
};

export function ongoingSumNums<Base extends string>(
  varbNameBase: Base,
  updateFnArrProp: UpdateFnProp[],
  switchInit: SwitchTargetKey<"periodic"> = "monthly"
): UpdateGroup<Base, "periodic"> {
  const props = getSwitchUpdateFnProps({ nums: updateFnArrProp }, "periodic");
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

function switchEndingToUpdateProp<
  SN extends SwitchName,
  SK extends SwitchKey<SN>
>(info: UpdateFnProp, switchName: SN, switchKey: SK): UpdateFnProp {
  if (info.infoType === "varbPathName") {
    return {
      ...info,
      varbPathName: getSwitchVarbName(
        info.varbPathName,
        switchName,
        switchKey
      ) as any as VarbPathName,
    };
  } else {
    return {
      ...info,
      varbName: getSwitchVarbName(info.varbName, switchName, switchKey) as any,
    } as any;
  }
}

function updatePropsPlusGroupEnding<
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
        updatePropsPlusGroupEnding(props, switchName, switchKey);
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
  switchInit: StateValue<SwitchValueName<"monthsYearsInput">>,
  options?: SwitchOptions<"monthsYearsInput">
): UpdateGroup<BN, "monthsYearsInput"> {
  const varbNames = switchKeyToVarbNames(baseName, "monthsYearsInput");
  return updateGroup(baseName, "monthsYearsInput", switchInit, {
    ...options,
    editor: { updateFnName: "calcVarbs" },
    months: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [
            overrideSwitchS.switchIsActive(
              baseName,
              "monthsYearsInput",
              "years"
            ),
          ],
          updateBasics("yearsToMonths", {
            num: updateFnPropS.local(validateAnyVarbName(varbNames.years)),
          })
        ),
        updateOverride(
          [
            overrideSwitchS.switchIsActive(
              baseName,
              "monthsYearsInput",
              "months"
            ),
          ],
          updateBasicsS.loadSolvableTextByVarbInfo(
            validateAnyVarbName(varbNames.editor)
          )
        ),
      ],
      ...options?.months,
    },
    years: {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [
            overrideSwitchS.switchIsActive(
              baseName,
              "monthsYearsInput",
              "months"
            ),
          ],
          updateBasics("monthsToYears", {
            num: updateFnPropS.local(validateAnyVarbName(varbNames.months)),
          })
        ),
        updateOverride(
          [
            overrideSwitchS.switchIsActive(
              baseName,
              "monthsYearsInput",
              "years"
            ),
          ],
          updateBasicsS.loadSolvableTextByVarbInfo(
            validateAnyVarbName(varbNames.editor)
          )
        ),
      ],
      ...options?.years,
    },
  });
}

export function ongoingPureCalc<Base extends string>(
  baseName: Base,
  updatePacks: OngoingUpdatePacks,
  switchInit?: string
): UpdateGroup<Base, "periodic"> {
  const varbNames = switchKeyToVarbNames(baseName, "periodic");
  return {
    [varbNames.monthly]: updateVarb("numObj", updatePacks.monthly),
    [varbNames.yearly]: updateVarb("numObj", updatePacks.yearly),
    ...(switchInit && {
      [varbNames.switch]: updateVarb("string", {
        initValue: switchInit,
      }),
    }),
  } as UpdateGroup<Base, "periodic">;
}
