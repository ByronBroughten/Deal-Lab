import { Obj } from "../../../../../utils/Obj";
import { Merge } from "../../../../../utils/Obj/merge";
import { MergeUnionObjNonNullable } from "../../../../../utils/types/MergeUnionObj";
import { baseValueNames } from "../../baseSections/baseValues";
import { basicNumObjInherentProp } from "./numObjUpdates";
import {
  UpdatePropValues,
  RelUpdatePropTypeName,
  UpdatePropTypeName,
  UpdatePropValueName,
} from "./updateProps";

type GeneralGatherProps = {
  inherent: { [propName: string]: readonly UpdatePropTypeName[] };
  relSpecified: { [propName: string]: readonly RelUpdatePropTypeName[] };
};
const defaultGatherProp = {
  inherent: {},
  relSpecified: {},
} as const;
type DefaultGatherProp = typeof defaultGatherProp;

type CalcGatherProps<Rel extends GeneralGatherProps["relSpecified"]> = {
  inherent: typeof basicNumObjInherentProp;
  relSpecified: Rel;
};
function gatherProp<P extends Partial<GeneralGatherProps> = {}>(
  gatherProp?: P
): Merge<DefaultGatherProp, P> {
  return Obj.merge(defaultGatherProp, gatherProp ?? ({} as P));
}
function calcGatherProp<R extends GeneralGatherProps["relSpecified"]>(
  relSpecified: R
): CalcGatherProps<R> {
  return gatherProp({
    inherent: basicNumObjInherentProp,
    relSpecified,
  });
}

const allGatherProps = {
  none: gatherProp(),
  get direct() {
    return gatherProp({
      inherent: { value: baseValueNames },
    });
  },
  loadedDisplayName: gatherProp({
    inherent: { loadedDisplayName: ["string", "undefined"] as const },
  }),
  editorOrRowValues: gatherProp({
    inherent: {
      editorOrRowValues: ["numObj", "conditionalRowValuesArr"] as const,
    },
  }),
  currentAndEditor: gatherProp({
    inherent: { current: ["numObj"] as const, editor: ["numObj"] as const },
  }),
  currentAndLoaded: gatherProp({
    inherent: {
      current: ["numObj"] as const,
      loaded: ["numObj", "undefined"] as const,
    },
  }),
  numberEntities: gatherProp({
    inherent: {
      ...basicNumObjInherentProp,
      numberEntities: ["numberEntities"] as const,
    },
  }),
  // calculations
  num: calcGatherProp({ num: ["numObjNum"] as const }),
  nums: calcGatherProp({ nums: ["numObjNums"] as const }),
  leftRight: calcGatherProp({
    left: ["numObjNum"] as const,
    right: ["numObjNum"] as const,
  }),
  basePercentOfBase: calcGatherProp({
    base: ["numObjNum"] as const,
    percentOfBase: ["numObjNum"] as const,
  }),
  basePortionOfBase: calcGatherProp({
    base: ["numObjNum"] as const,
    portionOfBase: ["numObjNum"] as const,
  }),
  piMonthly: calcGatherProp({
    loanAmountDollarsTotal: ["numObjNum"] as const,
    interestRatePercentMonthly: ["numObjNum"] as const,
    loanTermMonths: ["numObjNum"] as const,
  }),
  piYearly: calcGatherProp({
    loanAmountDollarsTotal: ["numObjNum"] as const,
    interestRatePercentYearly: ["numObjNum"] as const,
    loanTermYears: ["numObjNum"] as const,
  }),
} as const;

export type AllGatherProps = typeof allGatherProps;
export type GatherName = keyof AllGatherProps;

type AllGatherPropTypeNames<G extends keyof AllGatherProps> =
  MergeUnionObjNonNullable<AllGatherProps[G]["inherent" | "relSpecified"]>;

type ArrToUnionObj<O extends { [key: string]: readonly any[] }> = {
  [Prop in keyof O]: O[Prop][number];
};

type GatherPropTypeName<G extends GatherName> = ArrToUnionObj<
  AllGatherPropTypeNames<G>
>;
type GatherPropType<G extends { [key: string]: UpdatePropValueName }> = {
  [Prop in keyof G]: UpdatePropValues[G[Prop]];
};
export type GatherProps<G extends GatherName> = GatherPropType<
  GatherPropTypeName<G> extends { [key: string]: UpdatePropValueName }
    ? GatherPropTypeName<G>
    : {}
>;
