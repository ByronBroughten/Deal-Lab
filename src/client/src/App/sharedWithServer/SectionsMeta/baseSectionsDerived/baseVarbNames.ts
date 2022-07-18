import { Obj } from "../../utils/Obj";
import { StringObj } from "../baseSectionsUtils/baseValues/StringObj";
import { baseVarbsS } from "../baseSectionsUtils/baseVarbs";

export const virtualVarbNames = Obj.keys(baseVarbsS.virtualVarb);
export type VirtualVarbName = typeof virtualVarbNames[number];

export const virtualVarbToValueNames = baseVarbsS.virtualVarb;
export type VirtualVarbToValues = {
  [VN in VirtualVarbName]: StringObj;
};
