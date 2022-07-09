import { BaseName } from "../../../baseSectionsDerived/baseSectionTypes";
import {
  CalculationName,
  LeftRightPropCalculations,
} from "../../../baseSectionsUtils/baseValues/calculations";
import { RelInVarbInfo } from "../../../childSectionsDerived/RelInOutVarbInfo";
import { relVarbInfoS } from "../../../childSectionsDerived/RelVarbInfo";
import { PreNumObjOptions, relVarb, relVarbS } from "../relVarb";
import {
  DisplayName,
  NumObjRelVarb,
  StringRelVarb,
  UpdateFnProps,
} from "../relVarbTypes";

type SwitchProps<T extends BaseName> = [
  sectionName: T,
  displayName: DisplayName,
  updateFnName: LeftRightPropCalculations,
  leftRight: [RelInVarbInfo, RelInVarbInfo],
  switchValue: string,
  options?: PreNumObjOptions
];

export type SwitchVarbNames = {
  [switchValue: string]: string;
  switch: string;
};

type SwitchOptionProps = {
  nameExtension: string;
  updateFnName: CalculationName;
  updateFnProps: UpdateFnProps;
  switchValue: string;
  options?: PreNumObjOptions;
};
export type SwitchInputs = {
  [inputName: string]: NumObjRelVarb | StringRelVarb;
};

type DualSwitch<
  One extends string,
  Two extends string,
  Switch extends string
> = Record<One, NumObjRelVarb> &
  Record<Two, NumObjRelVarb> &
  Record<Switch, StringRelVarb>;

export function simpleSwitch<
  One extends BaseName,
  Two extends BaseName,
  Switch extends BaseName
>({
  option1: [
    sectionName1,
    displayName1,
    updateFnName1,
    leftRight1,
    switchValue1,
    options1 = {},
  ],
  option2: [
    sectionName2,
    displayName2,
    updateFnName2,
    leftRight2,
    switchValue2,
    options2 = {},
  ],
  switch: [switchSectionName, switchVarbName],
}: {
  option1: SwitchProps<One>;
  option2: SwitchProps<Two>;
  switch: [BaseName<"hasVarb">, Switch];
}): DualSwitch<One, Two, Switch> {
  const userInputSwitch = {
    updateFnName: "calcVarbs",
    updateFnProps: {},
    switchInfo: relVarbInfoS.local(switchVarbName),
  } as const;
  return {
    [sectionName1]: relVarbS.leftRightPropFn(
      displayName1,
      updateFnName1,
      leftRight1,
      {
        inUpdateSwitchProps: [
          { ...userInputSwitch, switchValue: switchValue1 },
        ],
        ...options1,
      }
    ),
    [sectionName2]: relVarbS.leftRightPropFn(
      displayName2,
      updateFnName2,
      leftRight2,
      {
        inUpdateSwitchProps: [
          { ...userInputSwitch, switchValue: switchValue2 },
        ],
        ...options2,
      }
    ),
    [switchVarbName]: relVarb("string", {
      initValue: switchValue1,
    }),
  } as DualSwitch<One, Two, Switch>;
}

export function switchInput(
  varbNames: SwitchVarbNames,
  displayName: DisplayName,
  switchOptions: SwitchOptionProps[],
  switchInitValue: string,
  shared?: PreNumObjOptions
): SwitchInputs {
  const numObjPreVarbs: { [varbName: string]: NumObjRelVarb } = {};

  for (const option of switchOptions) {
    const { switchValue } = option;

    numObjPreVarbs[varbNames[switchValue]] = relVarbS.switch(
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
    ...numObjPreVarbs,
    [varbNames.switch]: relVarb("string", {
      initValue: switchInitValue,
    }),
  };
}
