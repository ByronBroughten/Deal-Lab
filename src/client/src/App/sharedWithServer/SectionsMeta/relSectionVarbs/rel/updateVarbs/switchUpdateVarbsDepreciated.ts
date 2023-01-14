import {
  switchKeyToVarbNames,
  SwitchName,
} from "../../../baseSectionsVarbs/baseSwitchNames";
import { CalculationName } from "../../../baseSectionsVarbs/baseValues/calculations";
import { UpdateVarb, updateVarb, UpdateVarbOptions } from "../updateVarb";
import { updateBasics } from "../updateVarb/UpdateBasics";
import { UpdateFnProps } from "../updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  UpdateOverride,
  updateOverride,
} from "../updateVarb/UpdateOverrides";

type GeneralSwitchVarbNames = {
  [switchValue: string]: string;
  switch: string;
};
type SwitchOptionProps = {
  updateFnName: CalculationName;
  updateFnProps: UpdateFnProps;
  switchValue: string;
  options?: UpdateVarbOptions<"numObj">;
};
type SwitchUpdateVarbs = {
  [inputName: string]: UpdateVarb<"numObj"> | UpdateVarb<"string">;
}; //
export function switchUpdateVarbs<SN extends SwitchName>(
  baseVarbName: string,
  switchName: SN,
  switchOptions: SwitchOptionProps[],
  switchInitValue: string,
  shared?: UpdateVarbOptions<"numObj">
): SwitchUpdateVarbs {
  const varbNames = switchKeyToVarbNames(
    baseVarbName,
    switchName
  ) as GeneralSwitchVarbNames;
  const numObjRelVarbs: { [varbName: string]: UpdateVarb<"numObj"> } = {};
  for (const option of switchOptions) {
    const { switchValue } = option;
    numObjRelVarbs[varbNames[switchValue]] = updateVarb("numObj", {
      updateFnName: option.updateFnName,
      updateFnProps: option.updateFnProps,
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(varbNames.switch, option.switchValue)],
          updateBasics("calcVarbs", {})
        ) as UpdateOverride<"numObj">,
      ],
      ...shared,
      ...option.options,
    });
  }
  return {
    ...numObjRelVarbs,
    [varbNames.switch]: updateVarb("string", {
      initValue: switchInitValue,
    }),
  };
}
