import { Obj } from "../../utils/Obj";
import { StringObj } from "../allBaseSectionVarbs/baseValues/StringObj";
import { baseVarbsS } from "../allBaseSectionVarbs/baseVarbs";

export const virtualVarbNames = Obj.keys(baseVarbsS.virtualVarb);
export type VirtualVarbName = typeof virtualVarbNames[number];

type BaseVirtualVarb = typeof baseVarbsS.virtualVarb;

export const virtualVarbToValueNames: VirtualVarbToValueNames =
  virtualVarbNames.reduce((varbToValueNames, varbName) => {
    varbToValueNames[varbName] = baseVarbsS.virtualVarb[varbName].valueName;
    return varbToValueNames;
  }, {} as VirtualVarbToValueNames);
type VirtualVarbToValueNames = {
  [VVN in VirtualVarbName]: BaseVirtualVarb[VVN]["valueName"];
};

export type VirtualVarbToValues = {
  [VN in VirtualVarbName]: StringObj;
};
