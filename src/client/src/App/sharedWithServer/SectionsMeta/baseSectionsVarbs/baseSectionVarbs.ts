import { Merge } from "../../utils/Obj/merge";
import { BaseVarbSchemas } from "./baseVarbs";

export type GeneralBaseSectionVarbs = BaseVarbSchemas;

const _typeUniformityVarb: _TypeUniformityVarb = { _typeUniformity: "string" };
type _TypeUniformityVarb = { _typeUniformity: "string" };

export type BaseSection<V extends BaseVarbSchemas = {}> = Merge<
  V,
  _TypeUniformityVarb
>;
export function baseSectionVarbs<V extends BaseVarbSchemas = {}>(
  baseVarbs?: V
): BaseSection<V> {
  return { ...baseVarbs, ..._typeUniformityVarb } as any;
}
