import { BaseVarbSchemas } from "./baseVarbs";

export type BasePropName = keyof GeneralBaseSection;
export type GeneralBaseSection = {
  varbSchemas: BaseVarbSchemas;
};

const _typeUniformityVarb = { _typeUniformity: "string" } as const;

type BaseSection<V extends BaseVarbSchemas> = {
  varbSchemas: V & typeof _typeUniformityVarb;
};

export function baseSection<V extends BaseVarbSchemas>(
  varbSchemas?: V
): BaseSection<V> {
  return {
    varbSchemas: { ...varbSchemas, ..._typeUniformityVarb },
  } as BaseSection<V>;
}

export const baseSectionS = {
  get container() {
    return baseSection({
      _typeUniformity: "string",
    } as const);
  },
};
