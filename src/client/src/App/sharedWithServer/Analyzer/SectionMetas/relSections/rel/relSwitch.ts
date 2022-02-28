import { SwitchName, SwitchKey } from "../baseSections/baseSwitchSchemas";

type GeneralRelSwitchSchemas = {
  [SW in SwitchName]: Record<
    SwitchKey<SW>,
    {
      startAdornment?: string;
      endAdornment?: string;
      startDisplayName?: string;
      endDisplayName?: string;
    }
  >;
};

const relSwitchSchemas = {
  percent: {
    percent: {
      endAdornment: "%",
      endDisplayName: " (%)",
    },
    switch: {},
  },
  get dollarsPercent() {
    return {
      ...this.percent,
      dollars: {
        startAdornment: "$",
        endDisplayName: " ($)",
      },
      switch: {},
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
    switch: {},
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
    switch: {},
  },
};

const _testRelSwitchSchemas = <Test extends GeneralRelSwitchSchemas>(_: Test) =>
  undefined;
_testRelSwitchSchemas(relSwitchSchemas);

const relSwitch = {
  schemas: relSwitchSchemas,
};
