import { CalculationName } from "../../../baseSectionsVarbs/baseValues/calculations";
import {
  relSwitchVarbs,
  SwitchEndingKey,
  switchNames,
  TargetCoreGeneral,
} from "../../../baseSectionsVarbs/RelSwitchVarb";
import { relVarbInfoS } from "../../../SectionInfo/RelVarbInfo";
import { RelNumObjOptions, relVarb } from "../relVarb";
import { NumObjRelVarb, StringRelVarb } from "../relVarbTypes";
import { UpdateFnProps } from "../UpdateFnProps";

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
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(varbNames.switch),
          switchValue: option.switchValue,
          updateFnName: "calcVarbs",
          updateFnProps: {},
        },
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
