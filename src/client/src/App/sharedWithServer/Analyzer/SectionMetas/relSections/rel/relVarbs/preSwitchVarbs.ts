import {
  DisplayName,
  NumObjRelVarb,
  StringPreVarb,
  UpdateFnProps,
} from "../relVarbTypes";
import { InRelVarbInfo } from "../relVarbInfoTypes";
import { PreNumObjOptions, relVarb } from "../relVarb";
import { BaseName } from "../../baseSectionTypes";
import {
  CalculationName,
  LeftRightPropCalculations,
} from "../../baseSections/baseValues/NumObj/calculations";

type SwitchProps<T extends BaseName> = [
  sectionName: T,
  displayName: DisplayName,
  updateFnName: LeftRightPropCalculations,
  leftRight: [InRelVarbInfo, InRelVarbInfo],
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
  [inputName: string]: NumObjRelVarb | StringPreVarb;
};

type DualSwitch<
  One extends string,
  Two extends string,
  Switch extends string
> = Record<One, NumObjRelVarb> &
  Record<Two, NumObjRelVarb> &
  Record<Switch, StringPreVarb>;

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
    switchInfo: {
      sectionName: switchSectionName,
      varbName: switchVarbName,
      id: "local",
      idType: "relative",
    },
  } as const;
  return {
    [sectionName1]: relVarb.leftRightPropFn(
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
    [sectionName2]: relVarb.leftRightPropFn(
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
    [switchVarbName]: relVarb.type("string", { initValue: switchValue1 }),
  } as DualSwitch<One, Two, Switch>;
}

export function switchInput(
  varbNames: SwitchVarbNames,

  displayName: DisplayName,
  sectionName: BaseName<"hasVarb">,
  switchOptions: SwitchOptionProps[],
  switchInitValue: string,
  shared?: PreNumObjOptions
): SwitchInputs {
  const numObjPreVarbs: { [varbName: string]: NumObjRelVarb } = {};

  for (const option of switchOptions) {
    const { switchValue } = option;

    numObjPreVarbs[varbNames[switchValue]] = relVarb.switch(
      displayName,
      option.updateFnName,
      option.updateFnProps,
      [
        {
          switchInfo: {
            sectionName,
            varbName: varbNames.switch,
            id: "local",
            idType: "relative",
          },
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
    [varbNames.switch]: relVarb.type("string", {
      initValue: switchInitValue,
    }),
  };
}
