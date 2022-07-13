import { pick } from "lodash";
import { Obj } from "../../utils/Obj";
import { Merge } from "../../utils/Obj/merge";
import { StrictPick } from "../../utils/types";

// for all the types, I might want to make the core separate again.
class RelSwitchVarb<C extends GeneralRelSwitchCore> {
  constructor(readonly core: C) {}
  get targets(): C["targets"] {
    return this.core.targets;
  }
  target<T extends keyof C["targets"]>(targetName: T): C["targets"][T] {
    return this.targets[targetName];
  }
  targetOptions<T extends keyof C["targets"]>(
    targetName: T
  ): StrictPick<
    C["targets"][T],
    "endAdornment" | "displayNameEnd" | "startAdornment"
  > {
    return pick(this.target(targetName), [
      "endAdornment",
      "displayNameEnd",
      "startAdornment",
    ]);
  }
  get targetEndings(): {
    [T in keyof C["targets"]]: C["targets"][T]["varbNameEnding"];
  } {
    return Obj.keys(this.targets).reduce((endings, targetKey) => {
      endings[targetKey] = this.targets[targetKey].varbNameEnding;
      return endings;
    }, {} as { [T in keyof C["targets"]]: C["targets"][T]["varbNameEnding"] });
  }
  get switchEnding(): C["switch"]["varbNameEnding"] {
    return this.core.switch.varbNameEnding;
  }
  get targetKeys(): (keyof C["targets"])[] {
    return Obj.keys(this.core.targets);
  }
}

function makeDefaultTargetCore<DC extends TargetCoreGeneral>(dc: DC): DC {
  return dc;
}
const defaultTargetCore = makeDefaultTargetCore({
  varbNameEnding: "",
  displayNameEnd: "",
  startAdornment: "",
  endAdornment: "",
} as const);
type DefaultTargetCore = typeof defaultTargetCore;

function targetCore<T extends Partial<TargetCoreGeneral>>(
  targetCore: T
): Merge<DefaultTargetCore, T> {
  return {
    ...defaultTargetCore,
    ...targetCore,
  } as Partial<TargetCoreGeneral> as any;
}

export const ongoingVarb = new RelSwitchVarb({
  targets: {
    monthly: targetCore({
      endAdornment: "/month",
      varbNameEnding: "Monthly",
      displayNameEnd: " monthly",
    } as const),
    yearly: targetCore({
      endAdornment: "/year",
      varbNameEnding: "Yearly",
      displayNameEnd: " yearly",
    } as const),
  },
  switch: {
    varbNameEnding: "OngoingSwitch",
  },
});

export type TargetCoreGeneral = {
  startAdornment: string;
  endAdornment: string;
  varbNameEnding: string;
  displayNameEnd: string;
};

type GeneralRelSwitchCore = {
  targets: {
    [key: string]: TargetCoreGeneral;
  };
  switch: {
    varbNameEnding: string;
  };
};

function makeRelSwitchCores<
  Cores extends { [key: string]: GeneralRelSwitchCore }
>(cores: Cores): Cores {
  return cores;
}

export const relSwitchVarbs = {
  ongoing: ongoingVarb,
  dollarsPercent: new RelSwitchVarb({
    targets: {
      percent: targetCore({
        endAdornment: "%",
        varbNameEnding: "Percent",
        displayNameEnd: " percent",
      } as const),
      dollars: targetCore({
        startAdornment: "$",
        varbNameEnding: "Dollars",
        displayNameEnd: " dollars",
      }),
    },
    switch: {
      varbNameEnding: "UnitSwitch",
    },
  }),
  monthsYears: new RelSwitchVarb({
    targets: {
      months: targetCore({
        endAdornment: "months",
        varbNameEnding: "Months",
        displayNameEnd: " months",
      }),
      years: targetCore({
        endAdornment: "years",
        varbNameEnding: "Years",
        displayNameEnd: " years",
      }),
    },
    switch: {
      varbNameEnding: "SpanSwitch",
    },
  }),
};
type RelSwitchVarbs = typeof relSwitchVarbs;
export type RelSwitchName = keyof RelSwitchVarbs;

type NamePlusEndings<
  Base extends string,
  Endings extends Record<string, string>
> = {
  [Prop in keyof Endings]: `${string & Base}${Endings[Prop]}`;
};

export function baseNamePlusEndings<
  Base extends string,
  Endings extends Record<string, string>,
  ToReturn extends NamePlusEndings<Base, Endings>
>(baseName: Base, endings: Endings): ToReturn {
  return Obj.keys(endings).reduce((names, prop) => {
    names[prop] = `${baseName}${endings[prop]}` as ToReturn[typeof prop];
    return names;
  }, {} as Partial<ToReturn>) as ToReturn;
}

export const switchEndings = {
  dollarsPercent: {
    percent: "Percent",
    dollars: "Dollars",
    switch: "UnitSwitch",
  },
  ongoing: {
    monthly: "Monthly",
    yearly: "Yearly",
    switch: "OngoingSwitch",
  },
  monthsYears: {
    months: "Months",
    years: "Years",
    switch: "SpanSwitch",
  },
} as const;
export type SwitchEndings = typeof switchEndings;
export type SwitchEndingKey = keyof SwitchEndings;

export function switchNames<Base extends string, K extends keyof SwitchEndings>(
  baseName: Base,
  key: K
): NamePlusEndings<Base, SwitchEndings[K]> {
  return baseNamePlusEndings(baseName, switchEndings[key]);
}

export type SwitchRecord<
  Base extends string,
  Endings extends Record<string, string>,
  Val extends any
> = {
  [Prop in keyof Endings as `${string & Base}${Endings[Prop]}`]: Val;
};

export type SwitchEndingsBase = {
  [key: string]: string;
  switch: string;
};

export type BaseSwitchVarb<
  Base extends string,
  Endings extends SwitchEndingsBase
> = SwitchRecord<Base, Pick<Endings, "switch">, "string"> &
  SwitchRecord<Base, Omit<Endings, "switch">, "numObj">;

export type BaseOngoingVarb<T extends string> = BaseSwitchVarb<
  T,
  typeof switchEndings.ongoing
>;
