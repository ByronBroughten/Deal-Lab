import { Obj } from "../../../../utils/Obj";
import { SubType } from "../../../../utils/types";
import { BaseName } from "../BaseName";
import { FeBaseSectionVarbs } from "../baseNameArrs";
import {
  SwitchName,
  SwitchKey,
  BaseSwitchSchemas,
  baseSwitch,
} from "../baseSections/baseSwitch";

type GeneralRelSwitchSchemas = {
  [SW in SwitchName]: Record<
    SwitchKey<SW>,
    {
      startAdornment?: string;
      endAdornment?: string;
      startDisplayName?: string;
      endDisplayName?: string;
      initValue?: string;
    }
  >;
};

const defaultSwitch = {
  updateInfoArr: [
    {
      updateName: "direct",
      updateProps: {},
    },
  ],
} as const;

const relSwitchSchemas = {
  percent: {
    percent: {
      endAdornment: "%",
      endDisplayName: " (%)",
    },
    switch: { ...defaultSwitch, initValue: "percent" },
  },
  get dollarsPercent() {
    return {
      ...this.percent,
      dollars: {
        startAdornment: "$",
        endDisplayName: " ($)",
      },
      switch: { ...defaultSwitch, initValue: "dollars" },
    };
  },
  ongoing: {
    monthly: {
      endAdornment: "/month",
      endDisplayName: " (monthly)",
    },
    yearly: {
      endAdornment: "/year",
      endDisplayName: " (annual)",
    },
    switch: { ...defaultSwitch, initValue: "monthly" },
  },
  monthsYears: {
    months: {
      endAdornment: "months",
      endDisplayName: "(months)",
    },
    years: {
      endAdornment: "years",
      endDisplayName: "(years)",
    },
    switch: { ...defaultSwitch, initValue: "months" },
  },
} as const;
const _testRelSwitchSchemas = <Test extends GeneralRelSwitchSchemas>(_: Test) =>
  undefined;
_testRelSwitchSchemas(relSwitchSchemas);

export type RelSwitchSchemas = typeof relSwitchSchemas;

type SwitchSectionVarbSchemas<SW extends SwitchName> = Pick<
  FeBaseSectionVarbs,
  BaseName<SW>
>;
type SwitchVarbVarbSchemas<SW extends SwitchName> = {
  [SN in keyof SwitchSectionVarbSchemas<SW>]: SubType<
    SwitchSectionVarbSchemas<SW>[SN],
    { switchName: SW }
  >;
};
type SwitchNameVarbName<
  SW extends SwitchName,
  SN extends BaseName<SW>
> = keyof SwitchVarbVarbSchemas<SW>[SN];

export type SwitchBase<
  SW extends SwitchName,
  SN extends BaseName<SW>,
  Schemas = SwitchVarbVarbSchemas<SW>[SN][SwitchNameVarbName<SW, SN>]
> = Schemas["baseName" & keyof Schemas];
export type SwitchVarbName<
  SW extends SwitchName,
  SK extends SwitchKey<SW>,
  SN extends BaseName<SW>,
  SB extends SwitchBase<SW, SN>
> = keyof {
  [K in SK as `${SB & string}${BaseSwitchSchemas[SW][K] & string}`]: any;
};
function switchVarbName<
  SW extends SwitchName,
  SK extends SwitchKey<SW>,
  SN extends BaseName<SW>,
  SB extends SwitchBase<SW, SN>
>(switchName: SW, switchKey: SK, _sectionName: SN, baseName: SB) {
  return `${baseName}${baseSwitch.schemas[switchName][switchKey]}` as SwitchVarbName<
    SW,
    SK,
    SN,
    SB
  >;
}
export type SwitchVarbNames<
  SW extends SwitchName,
  SN extends BaseName<SW>,
  SB extends SwitchBase<SW, SN>
> = {
  [SK in SwitchKey<SW>]: SwitchVarbName<SW, SK, SN, SB>;
};
function switchVarbNames<
  SW extends SwitchName,
  SN extends BaseName<SW>,
  SB extends SwitchBase<SW, SN>
>(switchName: SW, sectionName: SN, baseName: SB) {
  const switchKeys = Obj.keys(baseSwitch.schemas[switchName]);
  return switchKeys.reduce((targets, switchKey) => {
    targets[switchKey] = switchVarbName(
      switchName,
      switchKey,
      sectionName,
      baseName
    );
    return targets;
  }, {} as any) as SwitchVarbNames<SW, SN, SB>;
}

export const relSwitch = {
  schemas: relSwitchSchemas,
  varbName: switchVarbName,
  varbNames: switchVarbNames,
  keyArr: baseSwitch.keyArr,
};
// alias for outside of the rel schema
export const switchStuff = relSwitch;
