import { Obj } from "../../../../utils/Obj";
import { BaseName } from "../../../baseSectionsDerived/baseSectionTypes";
import { NumObjUpdateFnName } from "../../../baseSectionsUtils/baseValues/updateFnNames";
import {
  ongoingVarb,
  SwitchEndingKey,
  SwitchEndings,
  switchNames,
  SwitchRecord,
} from "../../../baseSectionsUtils/RelSwitchVarb";
import { RelInVarbInfo } from "../../../childSectionsDerived/RelInOutVarbInfo";
import { relVarbInfoS } from "../../../childSectionsDerived/RelVarbInfo";
import { relVarbsS } from "../../relVarbs";
import { RelNumObjOptions, relVarb, relVarbS } from "../relVarb";
import { DisplayName, StringRelVarb, UpdateFnProps } from "../relVarbTypes";

export type SwitchRelVarbs<
  Base extends string,
  Key extends SwitchEndingKey
> = SwitchRecord<Base, Pick<SwitchEndings[Key], "switch">, StringRelVarb> &
  // @ts-ignore
  SwitchRecord<Base, Omit<SwitchEndings[Key], "switch">, StringRelVarb>;

const ongoingVarbSpanEndings = ongoingVarb.targetEndings;
const ongoingSpans = ongoingVarb.targetKeys;

export type MonthlyYearlySwitchOptions = {
  monthly?: RelNumObjOptions;
  yearly?: RelNumObjOptions;
  shared?: RelNumObjOptions;
  switchInit?: "monthly" | "yearly";
};

type MonthsYearsOptions = {
  months?: RelNumObjOptions;
  years?: RelNumObjOptions;
  shared?: RelNumObjOptions;
};
type MonthsYearsSwitchOptions = MonthsYearsOptions & {
  switchInit?: "months" | "years";
};

function concatVarbName(info: RelInVarbInfo, toConcat: string) {
  return { ...info, varbName: info.varbName + toConcat };
}

type MonthlyYearlyProps = { monthly: UpdateFnProps; yearly: UpdateFnProps };
function getMonthlyYearlyProps(
  updateFnProps: UpdateFnProps
): MonthlyYearlyProps {
  const monthlyYearlyProps: MonthlyYearlyProps = { monthly: {}, yearly: {} };

  for (const spanly of ongoingSpans) {
    for (const [propName, props] of Object.entries(updateFnProps)) {
      const ongoingNameEnding = ongoingVarbSpanEndings[spanly];
      if (Array.isArray(props)) {
        const nextProps = props.map((prop) =>
          concatVarbName(prop, ongoingNameEnding)
        );
        monthlyYearlyProps[spanly][propName] = nextProps;
      } else
        monthlyYearlyProps[spanly][propName] = concatVarbName(
          props,
          ongoingNameEnding
        );
    }
  }
  return monthlyYearlyProps;
}

type UpdatePropPack = {
  updateFnName: NumObjUpdateFnName;
  updateFnProps: UpdateFnProps;
};

type OngoingUpdatePacks = {
  monthly: UpdatePropPack;
  yearly: UpdatePropPack;
};
export type UpdatePacksOrSectionNames = {
  [prop in keyof OngoingUpdatePacks]: UpdatePropPack | BaseName<"hasVarb">;
};

function getOngoingUpdatePacks<Base extends string>(
  baseVarbName: Base,
  updatePacksOrSectionNames: UpdatePacksOrSectionNames
) {
  const updatePacks: any = {};
  const defaultUpdateFnNames = {
    monthly: "yearlyToMonthly",
    yearly: "monthlyToYearly",
  } as const;
  const varbNames = switchNames(baseVarbName, "ongoing");
  for (const [spanly, packOrName] of Obj.entries(updatePacksOrSectionNames)) {
    if (typeof packOrName === "string")
      updatePacks[spanly] = {
        updateFnName: defaultUpdateFnNames[spanly],
        updateFnProps: {
          nums: [relVarbInfoS.local(varbNames.yearly)],
        },
      };
    else updatePacks[spanly] = packOrName;
  }
  return updatePacks as OngoingUpdatePacks;
}

export function monthsYearsInput<Base extends string>(
  baseVarbName: Base,
  displayName: string,
  { switchInit = "months", ...options }: MonthsYearsSwitchOptions = {}
): SwitchRelVarbs<Base, "monthsYears"> {
  const varbNames = switchNames(baseVarbName, "monthsYears");
  return relVarbsS.switchInput(
    baseVarbName,
    "monthsYears",
    displayName,
    [
      {
        updateFnName: "yearsToMonths",
        updateFnProps: {
          num: relVarbInfoS.local(varbNames.years),
        },
        switchValue: "months",
        options: {
          endAdornment: " months",
          ...options.shared,
          ...options.months,
        },
      },
      {
        updateFnName: "monthsToYears",
        updateFnProps: {
          num: relVarbInfoS.local(varbNames.months),
        },
        switchValue: "years",
        options: {
          endAdornment: " years",
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
  displayName: string,
  { switchInit = "monthly", ...options }: MonthlyYearlySwitchOptions = {}
): SwitchRelVarbs<Base, "ongoing"> {
  const varbNames = switchNames(baseVarbName, "ongoing");
  return relVarbsS.switchInput(
    baseVarbName,
    "ongoing",
    displayName,
    [
      {
        updateFnName: "yearlyToMonthly",
        updateFnProps: {
          num: relVarbInfoS.local(varbNames.yearly),
        },
        switchValue: "monthly",
        options: {
          endAdornment: "/month",
          ...options.monthly,
          ...options.shared,
        },
      },
      {
        updateFnName: "monthlyToYearly",
        updateFnProps: {
          num: relVarbInfoS.local(varbNames.monthly),
        },
        switchValue: "yearly",
        options: {
          endAdornment: "/year",
          ...options.yearly,
          ...options.shared,
        },
      },
    ],
    switchInit
  );
}

export function ongoingPercentToPortion<Base extends string>(
  baseVarbName: Base,
  displayName: DisplayName,
  makeBaseVarbInfo: (baseVarbName: string) => RelInVarbInfo,
  baseBaseName: string,
  percentName: string
): SwitchRelVarbs<Base, "ongoing"> {
  const varbNames = switchNames(baseVarbName, "ongoing");
  const baseVarbNames = switchNames(baseBaseName, "ongoing");
  return {
    [varbNames.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    [varbNames.monthly]: relVarbS.moneyMonth(displayName, {
      updateFnName: "percentToPortion",
      updateFnProps: {
        base: makeBaseVarbInfo(baseVarbNames.monthly),
        percentOfBase: relVarbInfoS.local(percentName),
      },
      displayNameEnd: " monthly",
    }),
    [varbNames.yearly]: relVarbS.moneyYear(displayName, {
      updateFnName: "percentToPortion",
      updateFnProps: {
        base: makeBaseVarbInfo(baseVarbNames.yearly),
        percentOfBase: relVarbInfoS.local(percentName),
      },
      displayNameEnd: " yearly",
    }),
  };
}

export function ongoingPureCalc<Base extends string>(
  baseVarbName: Base,
  displayName: DisplayName,
  updatePacksOrSectionNames: UpdatePacksOrSectionNames,
  options: MonthlyYearlySwitchOptions
): SwitchRelVarbs<Base, "ongoing"> {
  const varbNames = switchNames(baseVarbName, "ongoing");
  const updatePacks = getOngoingUpdatePacks(
    baseVarbName,
    updatePacksOrSectionNames
  );
  const { switchInit } = options;
  return {
    [varbNames.monthly]: relVarb("numObj", {
      displayName,
      ...ongoingVarb.targetOptions("monthly"),
      ...updatePacks.monthly,
      ...options.monthly,
      ...options.shared,
    }),
    [varbNames.yearly]: relVarb("numObj", {
      displayName,
      ...ongoingVarb.targetOptions("yearly"),
      ...updatePacks.yearly,
      ...options.yearly,
      ...options.shared,
    }),
    ...(switchInit && {
      [varbNames.switch]: relVarb("string", {
        initValue: switchInit,
      }),
    }),
  };
}
export function ongoingSumNums<Base extends string>(
  varbNameBase: Base,
  displayName: DisplayName,
  updateFnArrProp: RelInVarbInfo[],
  options: MonthlyYearlySwitchOptions = {}
): SwitchRelVarbs<Base, "ongoing"> {
  const props = getMonthlyYearlyProps({ nums: updateFnArrProp });
  const updateFnPacks = {
    monthly: {
      updateFnName: "sumNums",
      updateFnProps: props.monthly,
    },
    yearly: {
      updateFnName: "sumNums",
      updateFnProps: props.yearly,
    },
  } as const;
  return relVarbsS.ongoingPureCalc(
    varbNameBase,
    displayName,
    updateFnPacks,
    options
  );
}
