import { Obj } from "../../../utils/Obj";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { StateValue } from "../../values/StateValue";
import {
  UnionValue,
  UnionValueName,
  ValueSource,
  ValueSourceType,
} from "../../values/StateValue/unionValues";
import { updateVarb, UpdateVarb } from "../updateVarb";
import { UpdateBasics, UpdateBasicsNext } from "./UpdateBasics";
import { UpdateFnProp } from "./UpdateFnProps";
import {
  updateOverride,
  UpdateOverrides,
  UpdateOverrideSwitchInfo,
} from "./UpdateOverrides";

export function completionStatusVarb(
  ...overrides: UpdateOverrides
): UpdateVarb<"completionStatus"> {
  return updateVarb("completionStatus", {
    initValue: "allEmpty",
    updateFnName: "throwIfReached",
    updateOverrides: overrides,
  });
}

export function completionStatusBasics(
  props: Partial<CompletionStatusProps>
): UpdateBasicsNext<"completionStatus"> {
  return {
    updateFnName: "completionStatus",
    updateFnProps: completionStatusProps(props),
  };
}

export type CompletionStatusProps = {
  nonZeros: UpdateFnProp[];
  nonNone: UpdateFnProp[];
  notFalse: UpdateFnProp[];
  validInputs: UpdateFnProp[];
  othersValid: UpdateFnProp[];
};

export function completionStatusProps(
  props: Partial<CompletionStatusProps>
): CompletionStatusProps {
  return {
    nonZeros: [],
    nonNone: [],
    notFalse: [],
    validInputs: [],
    othersValid: [],
    ...props,
  };
}

export function dealModeVarb(
  overrideMap: Record<StateValue<"dealMode">, UpdateBasics>
): UpdateVarb<"numObj"> {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: dealModeOverrides(overrideMap),
  });
}

export function dealModeOverrides(
  overrideMap: Record<StateValue<"dealMode">, UpdateBasics>,
  switchInfo?: UpdateOverrideSwitchInfo
): UpdateOverrides {
  return unionSwitchOverride(
    "dealMode",
    switchInfo ?? relVarbInfoS.local("dealMode"),
    overrideMap
  );
}

export function financingMethodOverrides(
  overrideMap: Record<StateValue<"financingMethod">, UpdateBasics>,
  switchInfo?: UpdateOverrideSwitchInfo
): UpdateOverrides {
  return unionSwitchOverride(
    "financingMethod",
    switchInfo ?? relVarbInfoS.local("financingMethod"),
    overrideMap
  );
}

export function valueSourceNumObj<VT extends ValueSourceType>(
  _valueSourceType: VT,
  overrideMap: Record<ValueSource<VT>, UpdateBasics>
): UpdateVarb<"numObj"> {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: valueSourceOverrides(_valueSourceType, overrideMap),
  });
}

export function valueSourceOverrides<VT extends ValueSourceType>(
  _valueSourceType: VT,
  updateBasics: Record<ValueSource<VT>, UpdateBasics>,
  switchInfo?: UpdateOverrideSwitchInfo
): UpdateOverrides {
  return unionSwitchOverride(
    _valueSourceType,
    switchInfo ?? relVarbInfoS.local("valueSourceName"),
    updateBasics
  );
}

export function unionSwitchOverride<UVN extends UnionValueName>(
  _unionValueName: UVN,
  switchInfo: UpdateOverrideSwitchInfo,
  updateBasics: Record<UnionValue<UVN>, UpdateBasics>
) {
  return Obj.keys(updateBasics).reduce((overrides, unionValue) => {
    overrides.push(
      updateOverride(
        [{ switchInfo, switchValues: [unionValue] }],
        updateBasics[unionValue]
      )
    );
    return overrides;
  }, [] as UpdateOverrides);
}
