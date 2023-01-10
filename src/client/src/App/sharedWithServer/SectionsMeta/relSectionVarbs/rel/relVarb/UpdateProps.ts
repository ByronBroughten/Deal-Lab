import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../../baseSectionsVarbs/baseValues/calculations";
import { ValueName } from "../../../baseSectionsVarbs/baseVarbDepreciated";
import { UpdateBasics } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateFnProp, UpdateFnProps } from "./UpdateFnProps";
import { UpdateOverrides } from "./UpdateOverrides";

export interface UpdateProps<VN extends ValueName = ValueName>
  extends UpdateBasics<VN> {
  updateOverrides: UpdateOverrides<VN>;
}

interface UpdatePropsNext<
  VN extends ValueName = ValueName,
  UN extends UpdateFnName<VN> = UpdateFnName<VN>,
  UP extends UpdateFnProps = UpdateFnProps,
  UO extends UpdateOverrides<VN> = UpdateOverrides<VN>
> {
  updateFnName: UN;
  updateFnProps: UP;
  updateOverrides: UO;
}
function updateProps<
  VN extends ValueName = ValueName,
  UN extends UpdateFnName<VN> = UpdateFnName<VN>,
  UP extends UpdateFnProps = UpdateFnProps,
  UO extends UpdateOverrides<VN> = UpdateOverrides<VN>
>({}) {}

export const updatePropsS = {
  simple<UN extends UpdateFnName>(updateFnName: UN) {
    return {
      updateFnName,
      updateFnProps: {},
      updateOverrides: [],
    } as const;
  },
  sumNums<N = UpdateFnProp[]>(nums: N) {
    return {
      updateFnName: "sumNums",
      updateFnProps: { nums },
      updateOverrides: [],
    } as const;
  },
  singlePropCalc(updateFnName: NumPropCalcName, num: UpdateFnProp) {
    return {
      updateFnName,
      updateFnProps: { num },
      updateOverrides: [],
    } as const;
  },
  leftRightPropCalc(
    updateFnName: LeftRightPropCalcName,
    leftSide: UpdateFnProp,
    rightSide: UpdateFnProp
  ) {
    return {
      updateFnName,
      updateFnProps: { leftSide, rightSide },
      updateOverrides: [],
    };
  },
};
