import { CalculationName } from "../../../baseSectionsVarbs/baseValues/calculations";
import {
  relSwitchVarbs,
  SwitchEndingKey,
  switchNames,
  TargetCoreGeneral,
} from "../../../baseSectionsVarbs/RelSwitchVarb";
import { RelNumObjOptions, relVarb } from "../relVarb";
import { updateBasics } from "../relVarb/UpdateBasics";
import { UpdateFnProps } from "../relVarb/UpdateFnProps";
import {
  overrideSwitchS,
  UpdateOverride,
  updateOverride,
} from "../relVarb/UpdateOverrides";
import { NumObjRelVarb, StringRelVarb } from "../relVarbTypes";

type GeneralSwitchVarbNames = {
  [switchValue: string]: string;
  switch: string;
};

type SwitchOptionProps = {
  updateFnName: CalculationName;
  updateFnProps: UpdateFnProps;
  switchValue: string;
  options?: RelNumObjOptions;
};
export type SwitchInputs = {
  [inputName: string]: NumObjRelVarb | StringRelVarb;
};

export function switchInput<SWK extends SwitchEndingKey>(
  baseVarbName: string,
  switchName: SWK,
  displayName: string,
  switchOptions: SwitchOptionProps[],
  switchInitValue: string,
  shared?: RelNumObjOptions
): SwitchInputs {
  const varbNames = switchNames(
    baseVarbName,
    switchName
  ) as GeneralSwitchVarbNames;
  const switchVarb = relSwitchVarbs[switchName];

  const numObjRelVarbs: { [varbName: string]: NumObjRelVarb } = {};

  for (const option of switchOptions) {
    const { switchValue } = option;

    const targetCore = (
      switchVarb.targets as Record<string, TargetCoreGeneral>
    )[switchValue];

    numObjRelVarbs[varbNames[switchValue]] = relVarb("numObj", {
      displayName,
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
      displayNameEnd: targetCore.displayNameEnd,
    });
  }
  return {
    ...numObjRelVarbs,
    [varbNames.switch]: relVarb("string", {
      initValue: switchInitValue,
    }),
  };
}
