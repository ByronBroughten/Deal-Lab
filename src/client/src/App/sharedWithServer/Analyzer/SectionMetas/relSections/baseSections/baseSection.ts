import { omit } from "lodash";
import { Obj } from "../../../../utils/Obj";
import { baseVarbs, BaseVarbSchemas } from "./baseVarbs";

type BaseSectionTemplate = {
  alwaysOne: boolean;
  makeOneOnStartup: boolean;
  loadOnLogin: boolean;
  feGuestAccess: boolean;
  varbSchemas: BaseVarbSchemas;
  solvesForFinal: boolean;
  hasGlobalVarbs: boolean;
};

type Options = Partial<BaseSectionTemplate>;
export const baseOptions = {
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
  fallback: {
    alwaysOne: false,
    loadOnLogin: false,
    makeOneOnStartup: false,
    feGuestAccess: false,
    solvesForFinal: false,
    hasGlobalVarbs: false,
  },
} as const;

type FallbackSchema = typeof baseOptions.fallback;
type ReturnSchema<V extends BaseVarbSchemas, O extends Options> = {
  varbSchemas: V;
} & Omit<FallbackSchema, keyof O> &
  O;

export const baseSection = {
  schema<V extends BaseVarbSchemas, O extends Options = {}>(
    varbSchemas: V,
    options?: O
  ): ReturnSchema<V, O> {
    return {
      varbSchemas,
      ...omit(baseOptions.fallback, Obj.keys(options ?? {})),
      ...options,
    } as ReturnSchema<V, O>;
  },
  get singleTimeListSolves() {
    return this.schema(baseVarbs.singleTimeList, { solvesForFinal: true });
  },
  get ongoingListSolves() {
    return this.schema(baseVarbs.ongoingList, { solvesForFinal: true });
  },
  get table() {
    return this.schema(baseVarbs.table, {
      ...baseOptions.alwaysOneFromStart,
      loadOnLogin: true,
      feGuestAccess: true,
    });
  },
  get rowIndex() {
    return this.schema(baseVarbs.tableRow, { loadOnLogin: true });
  },
  get propertyBase() {
    return this.schema(baseVarbs.property);
  },
};
