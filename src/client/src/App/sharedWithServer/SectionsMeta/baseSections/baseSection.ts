import { omit } from "lodash";
import { Obj } from "../../utils/Obj";
import { baseVarbs, BaseVarbSchemas } from "./baseVarbs";

export type GeneralBaseSection = {
  alwaysOne: boolean;
  makeOneOnStartup: boolean;
  varbSchemas: BaseVarbSchemas;
  solvesForFinal: boolean;
  hasGlobalVarbs: boolean;
  uniqueDbId: boolean;
  placeholder: boolean;
};

type BaseSectionOptions = Partial<GeneralBaseSection>;
export const baseOptions = {
  alwaysOneFromStart: {
    alwaysOne: true,
    makeOneOnStartup: true,
  },
  get defaultSection() {
    return {
      ...this.alwaysOneFromStart,
    };
  },
  userList: {
    uniqueDbId: true,
  },
  fallback: {
    alwaysOne: false,
    makeOneOnStartup: false,
    solvesForFinal: false,
    hasGlobalVarbs: false,
    uniqueDbId: false,
    placeholder: false,
  },
} as const;

type FallbackSchema = typeof baseOptions.fallback;
type ReturnSchema<V extends BaseVarbSchemas, O extends BaseSectionOptions> = {
  varbSchemas: V;
} & Omit<FallbackSchema, keyof O> &
  O;

export const baseSection = {
  schema<V extends BaseVarbSchemas, O extends BaseSectionOptions = {}>(
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
    });
  },
  varbList<O extends BaseSectionOptions = {}>(options?: O) {
    return this.schema(
      {
        ...baseVarbs.savableSection,
        defaultValueSwitch: "string",
      },
      (options ?? {}) as O
    );
  },
  get tableName() {
    return this.schema(
      { titleFilter: "string" },
      {
        ...baseOptions.alwaysOneFromStart,
        placeholder: true,
      }
    );
  },
  get rowIndex() {
    return this.schema(baseVarbs.tableRow);
  },
  get propertyBase() {
    return this.schema(baseVarbs.property);
  },
};
