import { omit } from "lodash";
import { Obj } from "../../utils/Obj";
import { BaseVarbSchemas } from "./baseVarbs";

export type BasePropName = keyof GeneralBaseSection;
export type GeneralBaseSection = {
  varbSchemas: BaseVarbSchemas;
  hasGlobalVarbs: boolean;
};

type BaseSectionOptions = Partial<GeneralBaseSection>;
export const baseOptions = {
  fallback: {
    hasGlobalVarbs: false,
  },
} as const;

type FallbackSchema = typeof baseOptions.fallback;
type ReturnSchema<V extends BaseVarbSchemas, O extends BaseSectionOptions> = {
  varbSchemas: V;
} & Omit<FallbackSchema, keyof O> &
  O;

export function baseSection<
  V extends BaseVarbSchemas,
  O extends BaseSectionOptions = {}
>(varbSchemas: V, options?: O): ReturnSchema<V, O> {
  return {
    varbSchemas,
    ...omit(baseOptions.fallback, Obj.keys(options ?? {})),
    ...options,
  } as ReturnSchema<V, O>;
}

export const baseSectionS = {
  get container() {
    return baseSection({
      _typeUniformity: "string",
    } as const);
  },
};
