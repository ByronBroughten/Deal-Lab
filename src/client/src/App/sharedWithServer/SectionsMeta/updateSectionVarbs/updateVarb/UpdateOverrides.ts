import { isString } from "lodash";
import { Obj } from "../../../utils/Obj";
import { VarbNameWide } from "../../baseSectionsDerived/baseSectionsVarbsTypes";
import { relVarbInfoS, rviS } from "../../SectionInfo/RelVarbInfo";
import {
  UnionValue,
  UnionValueName,
  ValueSource,
  ValueSourceType,
} from "../../values/StateValue/unionValues";
import { ValueName } from "../../values/ValueName";
import { UpdateBasics } from "./UpdateBasics";
import {
  collectUpdateFnSwitchProps,
  UpdateFnProp,
  updateFnProp,
} from "./UpdateFnProps";
import { updateOverride, UpdateOverride } from "./UpdateOverride";
import {
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
  union<UVN extends UnionValueName>(
    _unionValueName: UVN,
    switchInfo: VarbNameWide | UpdateOverrideSwitchInfo,
    valueToBasics: Record<UnionValue<UVN>, UpdateBasics>,
    sharedSwitches: UpdateOverrideSwitches = []
  ) {
    return Obj.keys(valueToBasics).reduce((overrides, unionValue) => {
      overrides.push(
        updateOverride(
          [
            {
              switchInfo: isString(switchInfo)
                ? rviS.local(switchInfo)
                : switchInfo,
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
