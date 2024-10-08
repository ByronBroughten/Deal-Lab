import { isString } from "lodash";
import {
  relVarbInfoS,
  rviS,
} from "../../../StateGetters/Identifiers/RelVarbInfo";
import { Obj } from "../../../utils/Obj";
import { VarbNameWide } from "../../fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { ValueName } from "../../schema1ValueNames";
import {
  UnionValue,
  UnionValueName,
  ValueSource,
  ValueSourceType,
} from "../../schema4ValueTraits/StateValue/unionValues";
import { UpdateBasics } from "./UpdateBasics";
import {
  collectUpdateFnSwitchProps,
  UpdateFnProp,
  updateFnProp,
} from "./UpdateFnProps";
import { UpdateOverride, updateOverride } from "./UpdateOverride";
import {
  osS,
  StandardSP,
  UpdateOverrideSwitches,
  UpdateOverrideSwitchInfo,
} from "./UpdateOverrideSwitch";

export type UpdateOverrides<VN extends ValueName = ValueName> =
  UpdateOverride<VN>[];

export type ValueSourceOptions = {
  switchInfo?: VarbNameWide | UpdateOverrideSwitchInfo;
  sharedSwitches?: UpdateOverrideSwitches;
};

export type DealModeBasics = Record<UnionValue<"dealMode">, UpdateBasics>;
const updateOverridesS = {
  dealMode(
    overrideMap: Record<UnionValue<"dealMode">, UpdateBasics>,
    options?: ValueSourceOptions
  ): UpdateOverrides {
    return this.union(
      "dealMode",
      options?.switchInfo ?? relVarbInfoS.local("dealMode"),
      overrideMap,
      options?.sharedSwitches
    );
  },
  valueSource<VT extends ValueSourceType>(
    _valueSourceType: VT,
    updateBasics: Record<ValueSource<VT>, UpdateBasics>,
    options: ValueSourceOptions = {}
  ): UpdateOverrides {
    return this.union(
      _valueSourceType,
      options.switchInfo ?? relVarbInfoS.local("valueSourceName"),
      updateBasics,
      options.sharedSwitches
    );
  },
  boolean(
    finder: StandardSP,
    basics: {
      true: UpdateBasics;
      false: UpdateBasics;
    }
  ) {
    return [
      updateOverride([osS.isTrue(finder)], basics.true),
      updateOverride([osS.isFalse(finder)], basics.false),
    ];
  },
  union<UVN extends UnionValueName>(
    _unionValueName: UVN,
    switchProp: VarbNameWide | UpdateOverrideSwitchInfo,
    valueToBasics: Record<UnionValue<UVN>, UpdateBasics>,
    sharedSwitches: UpdateOverrideSwitches = []
  ) {
    const switchInfo = isString(switchProp)
      ? rviS.local(switchProp)
      : switchProp;
    return Obj.keys(valueToBasics).reduce((overrides, unionValue) => {
      overrides.push(
        updateOverride(
          [
            {
              switchInfo,
              switchValues: [unionValue],
            },
            ...sharedSwitches,
          ],
          valueToBasics[unionValue]
        )
      );
      return overrides;
    }, [] as UpdateOverrides);
  },
} as const;

export const uosS = updateOverridesS;

export function collectOverrideSwitchProps(
  updateOverrides: UpdateOverrides
): UpdateOverrides {
  let nextOverrides: UpdateOverrides = [];
  for (const { switches, updateFnProps, ...rest } of updateOverrides) {
    const andOverrideSwitches: UpdateFnProp[] = [];
    for (const updateSwitch of switches) {
      const { switchInfo } = updateSwitch;
      andOverrideSwitches.push(updateFnProp(switchInfo));
    }
    nextOverrides = nextOverrides.concat({
      switches,
      updateFnProps: collectUpdateFnSwitchProps({
        ...updateFnProps,
        andOverrideSwitches,
      }),
      ...rest,
    });
  }
  return nextOverrides;
}
