import { CalculationName } from "../../../baseSectionsUtils/baseValues/calculations";
import {
  relSwitchVarbs,
  SwitchEndingKey,
  switchNames,
  TargetCoreGeneral,
} from "../../../baseSectionsUtils/RelSwitchVarb";
import { relVarbInfoS } from "../../../childSectionsDerived/RelVarbInfo";
import { PreNumObjOptions, relVarb, relVarbS } from "../relVarb";
import { NumObjRelVarb, StringRelVarb, UpdateFnProps } from "../relVarbTypes";

type GeneralSwitchVarbNames = {
  [switchValue: string]: string;
  switch: string;
};

type SwitchOptionProps = {
  updateFnName: CalculationName;
  updateFnProps: UpdateFnProps;
  switchValue: string;
  options?: PreNumObjOptions;
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
  shared?: PreNumObjOptions
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

    numObjRelVarbs[varbNames[switchValue]] = relVarbS.switch(
      displayName,
      option.updateFnName,
      option.updateFnProps,
      [
        {
          switchInfo: relVarbInfoS.local(varbNames.switch),
          switchValue: option.switchValue,
          updateFnName: "calcVarbs",
          updateFnProps: {},
        },
      ],
      { ...option.options, ...shared }
    );
  }
  return {
    ...numObjRelVarbs,
    [varbNames.switch]: relVarb("string", {
      initValue: switchInitValue,
    }),
  };
}
