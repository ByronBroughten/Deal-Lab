import {
  fixedVarbPathNames,
  ValueFixedVarbPathName,
} from "../StateGetters/Identifiers/ValueInEntityInfo";
import {
  getVarbPathParams,
  VarbPathNameProp,
  VarbPathParams,
} from "../StateGetters/Identifiers/VarbPathNameInfo";
import { DealMode, getDealModes } from "../stateSchemas/StateValue/dealMode";

export type VarbPathArrParam<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> = VarbPathParams<VPN> & VarbPathNameProp<VPN>;

export const fixedVarbOptionArrs = getDealModes("plusMixed").reduce(
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
  {} as Record<DealMode<"plusMixed">, VarbPathArrParam[]>
);
