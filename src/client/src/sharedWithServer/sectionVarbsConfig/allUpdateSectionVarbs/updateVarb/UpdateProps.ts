import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../StateValue/stateValuesShared/calculations";
import { ValueName } from "../../ValueName";
import { UpdateBasics } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateFnProp } from "./UpdateFnProps";
import { UpdateOverrides } from "./UpdateOverrides";

export interface UpdateProps<VN extends ValueName = ValueName>
  extends UpdateBasics<VN> {
  updateOverrides: UpdateOverrides<VN>;
}

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
