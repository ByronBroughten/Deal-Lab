import { Obj } from "../../utils/Obj";
import { StringObj } from "../baseSectionsVarbs/baseValues/StringObj";
import { baseVarbsS } from "../baseSectionsVarbs/baseVarbs";

export const virtualVarbNames = Obj.keys(baseVarbsS.virtualVarb);
export type VirtualVarbName = typeof virtualVarbNames[number];

export const virtualVarbToValueNames = baseVarbsS.virtualVarb;
export type VirtualVarbToValues = {
  [VN in VirtualVarbName]: StringObj;
};
