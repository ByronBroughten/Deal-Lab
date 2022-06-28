import { Obj } from "../../utils/Obj";
import { baseSections } from "../baseSections";

export const baseSectionVarbs = Obj.toNestedPropertyObj(
  baseSections.fe,
  "varbSchemas"
);
export type BaseSectionVarbs = typeof baseSectionVarbs;
