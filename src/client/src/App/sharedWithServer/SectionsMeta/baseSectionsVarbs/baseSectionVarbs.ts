import { Merge } from "../../utils/Obj/merge";
import { GeneralBaseSectionVarbs } from "../allBaseSectionVarbs";
import { BaseVarb, baseVarb } from "./baseVarbs";

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
