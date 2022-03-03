import { InRelVarbInfo } from "../relVarbInfoTypes";
import { relVarbs } from "../relVarbs";
import { DisplayName, PreNumObjOptions, relVarb } from "../relVarb";
import { ObjectEntries, ObjectKeys } from "../../../../../utils/Obj";
import { BaseName } from "../../baseNameArrs";
import {
  SwitchName,
  BaseSwitchSchemas,
  baseSwitchSchemas,
  switchVarbNames,
  SwitchRecord,
} from "../../baseSections/baseSwitch";
import { omit } from "lodash";
import { NumObjUpdateFnName } from "../../baseSections/baseValues/NumObj/updateFnNames";
import { relVarbInfo } from "../relVarbInfo";
import { relVarbsSwitch } from "./relVarbsSwitch";

type SwitchPreVarbs<Base extends string, Key extends SwitchName> = SwitchRecord<
  Base,
  Pick<BaseSwitchSchemas[Key], "switch">,
  StringRelVarb
> &
  // @ts-ignore
  SwitchRecord<Base, Omit<BaseSwitchSchemas[Key], "switch">, StringRelVarb>;

export const ongoingVarbSpanEndings = omit(baseSwitchSchemas.ongoing, [
  "switch",
]);
const ongoingEndingNames = ObjectKeys(ongoingVarbSpanEndings);
export type MonthlyYearlySwitchOptions = SwitchRelOptions<"ongoing">;

type MonthsYearsOptions = {
  months?: PreNumObjOptions;
  years?: PreNumObjOptions;
  shared?: PreNumObjOptions;
};
type MonthsYearsSwitchOptions = MonthsYearsOptions & {
  switchInit?: "months" | "years";
};

const relVarbsOngoing = {};

function concatVarbName(info: InRelVarbInfo, toConcat: string) {
  return { ...info, varbName: info.varbName + toConcat };
}

type MonthlyYearlyProps = { monthly: UpdateFnProps; yearly: UpdateFnProps };
function getMonthlyYearlyProps(
  updateFnProps: UpdateFnProps
): MonthlyYearlyProps {
  const monthlyYearlyProps: MonthlyYearlyProps = { monthly: {}, yearly: {} };

  for (const spanly of ongoingEndingNames) {
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
  const varbNames = switchVarbNames(baseVarbName, "ongoing");
  for (const [spanly, packOrName] of ObjectEntries(updatePacksOrSectionNames)) {
    if (typeof packOrName === "string")
      updatePacks[spanly] = {
        updateFnName: defaultUpdateFnNames[spanly],
        updateFnProps: {
          nums: [relVarbInfo.relative(packOrName, varbNames.yearly, "local")],
        },
      };
    else updatePacks[spanly] = packOrName;
  }
  return updatePacks as OngoingUpdatePacks;
}

export function monthsYearsInput<Base extends string>(
  baseVarbName: Base,
  displayName: DisplayName,
  sectionName: BaseName<"hasVarb">,
  { switchInit = "months", ...options }: MonthsYearsSwitchOptions = {}
): SwitchPreVarbs<Base, "monthsYears"> {
  const varbNames = switchVarbNames(baseVarbName, "monthsYears");
  return relVarbs.switchInput(
    varbNames,
    displayName,
    sectionName,
    [
      {
        nameExtension: "Months",
        updateFnName: "yearsToMonths",
        updateFnProps: {
          num: relVarbInfo.relative(sectionName, varbNames.years, "local"),
        },
        switchValue: "months",
        options: {
          endAdornment: " months",
          ...options.shared,
          ...options.months,
        },
      },
      {
        nameExtension: "Years",
        updateFnName: "monthsToYears",
        updateFnProps: {
          num: relVarbInfo.relative(sectionName, varbNames.months, "local"),
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
// export function ongoingInput<Base extends string>(
//   baseVarbName: Base,
//   displayName: DisplayName,
//   sectionName: BaseName<"hasVarb">,
//   { switchInit = "monthly", ...options }: MonthlyYearlySwitchOptions = {}
// ): SwitchPreVarbs<Base, "ongoing"> {
//   const varbNames = switchVarbNames(baseVarbName, "ongoing");
//   return relVarbs.switchInput(
//     varbNames,
//     displayName,
//     sectionName,
//     [
//       {
//         nameExtension: ongoingVarbSpanEndings.monthly,
//         updateFnName: "yearlyToMonthly",
//         updateFnProps: {
//           num: relVarbInfo.local(sectionName, varbNames.yearly),
//         },
//         switchValue: "monthly",
//         options: {
//           endAdornment: "/month",
//           ...options.monthly,
//           ...options.shared,
//         },
//       },
//       {
//         nameExtension: ongoingVarbSpanEndings.yearly,
//         updateFnName: "monthlyToYearly",
//         updateFnProps: {
//           num: relVarbInfo.relative(sectionName, varbNames.monthly, "local"),
//         },
//         switchValue: "yearly",
//         options: {
//           endAdornment: "/year",
//           ...options.yearly,
//           ...options.shared,
//         },
//       },
//     ],
//     switchInit
//   );
// }

export function ongoingPercentToPortion<Base extends string>(
  baseVarbName: Base,
  displayName: DisplayName,
  sectionName: BaseName<"hasVarb">,
  baseSectionName: BaseName<"alwaysOneHasVarb">,
  baseBaseName: string,
  percentName: string
): SwitchPreVarbs<Base, "ongoing"> {
  const varbNames = switchVarbNames(baseVarbName, "ongoing");
  const baseVarbNames = switchVarbNames(baseBaseName, "ongoing");
  return {
    [varbNames.switch]: relVarb.string({
      initValue: "monthly",
    }),
    [varbNames.monthly]: relVarb.moneyMonth(displayName, {
      updateFnName: "percentToPortion",
      updateFnProps: {
        base: relVarbInfo.static(baseSectionName, baseVarbNames.monthly),
        percentOfBase: relVarbInfo.local(sectionName, percentName),
      },
    }),
    [varbNames.yearly]: relVarb.moneyYear(displayName, {
      updateFnName: "percentToPortion",
      updateFnProps: {
        base: relVarbInfo.static(baseSectionName, baseVarbNames.yearly),
        percentOfBase: relVarbInfo.local(sectionName, percentName),
      },
    }),
  };
}

// export function ongoingPureCalc<Base extends string>(
//   baseVarbName: Base,
//   displayName: DisplayName,
//   updatePacksOrSectionNames: UpdatePacksOrSectionNames,
//   options: MonthlyYearlySwitchOptions
// ): SwitchPreVarbs<Base, "ongoing"> {
//   const varbNames = switchVarbNames(baseVarbName, "ongoing");
//   const updatePacks = getOngoingUpdatePacks(
//     baseVarbName,
//     updatePacksOrSectionNames
//   );
//   const { switchInit } = options;
//   return {
//     [varbNames.monthly]: relVarb.type("numObj", {
//       displayName,
//       endAdornment: "/month",
//       ...updatePacks.monthly,
//       ...options.monthly,
//       ...options.shared,
//     }),
//     [varbNames.yearly]: relVarb.type("numObj", {
//       displayName,
//       endAdornment: "/year",
//       ...updatePacks.yearly,
//       ...options.yearly,
//       ...options.shared,
//     }),
//     ...(switchInit && {
//       [varbNames.switch]: relVarb.string({ initValue: switchInit }),
//     }),
//   };
// }
// export function ongoingSumNums<Base extends string>(
//   varbNameBase: Base,
//   displayName: DisplayName,
//   updateFnArrProp: InRelVarbInfo[],
//   options: MonthlyYearlySwitchOptions = {}
// ): SwitchPreVarbs<Base, "ongoing"> {
//   const props = getMonthlyYearlyProps({ nums: updateFnArrProp });
//   const updateFnPacks = {
//     monthly: {
//       updateFnName: "sumNums",
//       updateFnProps: props.monthly,
//     },
//     yearly: {
//       updateFnName: "sumNums",
//       updateFnProps: props.yearly,
//     },
//   } as const;
//   return relVarbs.ongoingPureCalc(
//     varbNameBase,
//     displayName,
//     updateFnPacks,
//     options
//   );
// }
