import { Merge } from "../../utils/Obj/merge";
import { baseVarb, BaseVarb, GeneralBaseVarb } from "./baseVarbs";

export type GeneralBaseSectionVarbs = { [varbName: string]: GeneralBaseVarb };

const typeUniformityVarbProp: TypeUniformityVarbProp = {
  _typeUniformity: baseVarb("string"),
};
type TypeUniformityVarbProp = { _typeUniformity: BaseVarb<"string"> };

export type BaseSectionVarbs<V extends GeneralBaseSectionVarbs = {}> = Merge<
  V,
  TypeUniformityVarbProp
>;
export function baseSectionVarbs<V extends GeneralBaseSectionVarbs = {}>(
  baseVarbs?: V
): BaseSectionVarbs<V> {
  return { ...baseVarbs, ...typeUniformityVarbProp } as any;
}
