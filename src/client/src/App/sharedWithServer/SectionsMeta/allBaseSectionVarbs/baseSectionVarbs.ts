import { Merge } from "../../utils/Obj/merge";
import { baseVarb, GeneralBaseVarb, SimpleBaseVarb } from "./baseVarbs";

export type GeneralBaseSectionVarbs = { [varbName: string]: GeneralBaseVarb };

const typeUniformityVarbProp: TypeUniformityVarbProp = {
  _typeUniformity: baseVarb("string"),
};
type TypeUniformityVarbProp = { _typeUniformity: SimpleBaseVarb<"string"> };

export type BaseSectionVarbs<V extends GeneralBaseSectionVarbs = {}> = Merge<
  V,
  TypeUniformityVarbProp
>;
export function baseSectionVarbs<V extends GeneralBaseSectionVarbs = {}>(
  baseVarbs?: V
): BaseSectionVarbs<V> {
  return { ...baseVarbs, ...typeUniformityVarbProp } as any;
}
