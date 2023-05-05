import {
  getVarbPathParams,
  VarbPathNameProp,
  VarbPathParams,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import {
  DealModeOrMixed,
  dealModesPlusMixed,
} from "../SectionsMeta/values/StateValue/unionValues";
import {
  fixedVarbPathNames,
  ValueFixedVarbPathName,
} from "./ValueInEntityInfo";

export type VarbPathArrParam<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> = VarbPathParams<VPN> & VarbPathNameProp<VPN>;

export const fixedVarbOptionArrs = dealModesPlusMixed.reduce(
  (obj, dealMode) => {
    obj[dealMode] = fixedVarbPathNames[dealMode].map(
      (varbPathName) =>
        ({
          varbPathName,
          ...getVarbPathParams(varbPathName),
        } as VarbPathArrParam)
    );
    return obj;
  },
  {} as Record<DealModeOrMixed, VarbPathArrParam[]>
);
