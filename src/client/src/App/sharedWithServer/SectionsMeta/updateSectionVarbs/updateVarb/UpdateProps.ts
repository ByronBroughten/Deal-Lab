import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../values/StateValue/valuesShared/calculations";
import { ValueName } from "../../values/ValueName";
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
  simple<UN extends UpdateFnName>(
    updateFnName: UN
  ): {
    updateFnName: UN;
    updateFnProps: {};
    updateOverrides: [];
  } {
    return {
      updateFnName,
      updateFnProps: {},
      updateOverrides: [],
    };
  },
  sumNums<UN = UpdateFnProp[]>(
    nums: UN
  ): {
    updateFnName: "sumNums";
    updateFnProps: { nums: UN };
    updateOverrides: [];
  } {
    return {
      updateFnName: "sumNums",
      updateFnProps: { nums },
      updateOverrides: [],
    };
  },
  singlePropCalc<UN extends NumPropCalcName>(
    updateFnName: UN,
    num: UpdateFnProp
  ): {
    updateFnName: UN;
    updateFnProps: { num: UpdateFnProp };
    updateOverrides: [];
  } {
    return {
      updateFnName,
      updateFnProps: { num },
      updateOverrides: [],
    };
  },
  leftRightPropCalc<UN extends LeftRightPropCalcName>(
    updateFnName: UN,
    leftSide: UpdateFnProp,
    rightSide: UpdateFnProp
  ): {
    updateFnName: UN;
    updateFnProps: { leftSide: UpdateFnProp; rightSide: UpdateFnProp };
    updateOverrides: [];
  } {
    return {
      updateFnName,
      updateFnProps: { leftSide, rightSide },
      updateOverrides: [],
    };
  },
};
