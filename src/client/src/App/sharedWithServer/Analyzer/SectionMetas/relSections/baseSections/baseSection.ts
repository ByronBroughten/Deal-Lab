import { Obj } from "../../../../utils/Obj";
import { Spread } from "../../../../utils/Obj/merge";
import { baseVarbs, GeneralBaseVarbs } from "./baseVarbs";

export type GeneralBaseSection = {
  varbSchemas: GeneralBaseVarbs;
  alwaysOne: boolean;
  makeOneOnStartup: boolean;
  loadOnLogin: boolean;
  feGuestAccess: boolean;
  solvesForFinal: boolean;
  hasGlobalVarbs: boolean;
  protected: boolean;
};

type FullOptions = Omit<GeneralBaseSection, "varbSchemas">;
type Options = Partial<FullOptions>;
const fallbackOptions = {
  alwaysOne: false,
  loadOnLogin: false,
  makeOneOnStartup: false,
  feGuestAccess: false,
  solvesForFinal: false,
  hasGlobalVarbs: false,
  protected: false,
};
const fallbackTest = (_: FullOptions): void => undefined;
fallbackTest(fallbackOptions);
type FallbackOptions = typeof baseOptions.fallback;

export const baseOptions = {
  fallback: fallbackOptions,
  alwaysOneFromStart: {
    alwaysOne: true,
    makeOneOnStartup: true,
  },
  get defaultSection() {
    return {
      ...this.alwaysOneFromStart,
      feGuestAccess: true,
      loadOnLogin: true,
    };
  },
  userList: {
    loadOnLogin: true,
    feGuestAccess: true,
  },
} as const;

type BaseSection<
  V extends GeneralBaseVarbs = GeneralBaseVarbs,
  O extends Options = {}
> = Spread<[Spread<[FallbackOptions, O]>, { varbSchemas: V }]>;
export const baseSection = {
  schema<V extends GeneralBaseVarbs = GeneralBaseVarbs, O extends Options = {}>(
    varbSchemas: V,
    options?: O
  ): BaseSection<V, O> {
    type FirstSpread = Spread<[FallbackOptions, O]>;
    const firstSpread: FirstSpread = Obj.spread(
      baseOptions.fallback,
      options ?? ({} as O)
    );
    const final: Spread<[FirstSpread, { varbSchemas: V }]> = Obj.spread(
      firstSpread,
      { varbSchemas }
    );
    return final;
  },
  get singleTimeListSolves() {
    return this.schema(baseVarbs.singleTimeList, {
      solvesForFinal: true,
    } as const);
  },
  get ongoingListSolves() {
    return this.schema(baseVarbs.ongoingList, {
      solvesForFinal: true,
    } as const);
  },
  get table() {
    return this.schema(baseVarbs.table, {
      ...baseOptions.alwaysOneFromStart,
      loadOnLogin: true,
      feGuestAccess: true,
    } as const);
  },
  get rowIndex() {
    return this.schema(baseVarbs.tableRow, { loadOnLogin: true } as const);
  },
  get propertyBase() {
    return this.schema(baseVarbs.property);
  },
} as const;
