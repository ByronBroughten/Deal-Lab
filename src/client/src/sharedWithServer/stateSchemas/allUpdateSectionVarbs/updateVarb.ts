import { relVarbInfoS } from "../../StateGetters/Identifiers/RelVarbInfo";
import { Obj } from "../../utils/Obj";
import { StrictOmit } from "../../utils/types";
import { VarbNameWide } from "../derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { ChildName } from "../derivedFromChildrenSchemas/ChildName";
import { SectionName } from "../SectionName";
import { StateValue } from "../StateValue";
import { NumObj } from "../StateValue/NumObj";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../StateValue/stateValuesShared/calculations";
import { ValueSource, ValueSourceType } from "../StateValue/unionValues";
import { valueMetas } from "../valueMetas";
import { ValueName } from "../ValueName";
import { uosb } from "./updateVarb/OverrideBasics";
import { StandardUP, ubS, UpdateBasics } from "./updateVarb/UpdateBasics";
import { getUpdateFnNames, UpdateFnName } from "./updateVarb/UpdateFnName";
import {
  collectUpdateFnSwitchProps,
  CompletionStatusProps,
  UpdateFnProp,
  updatePropS,
  upS,
} from "./updateVarb/UpdateFnProps";
import {
  collectOverrideSwitchProps,
  DealModeBasics,
  uosS,
  UpdateOverrides,
  ValueSourceOptions,
} from "./updateVarb/UpdateOverrides";
import { UpdateOverrideSwitchInfo } from "./updateVarb/UpdateOverrideSwitch";
import { UpdateProps } from "./updateVarb/UpdateProps";

export interface GeneralUpdateVarb extends UpdateProps {
  valueName: ValueName;
  initValue: StateValue;
}

export interface UpdateVarb<VN extends ValueName>
  extends GeneralUpdateVarb,
    UpdateProps {
  valueName: VN;
  initValue: StateValue<VN>;
}
const checkUpdateVarb = <VN extends ValueName, T extends UpdateVarb<VN>>(
  _: VN,
  value: T
): T => value;

function defaultUpdateVarb<VN extends ValueName>(
  valueName: VN
): UpdateVarb<VN> {
  const valueMeta = valueMetas[valueName];
  return checkUpdateVarb(valueName, {
    valueName,
    initValue: valueMeta.initDefault() as StateValue<VN>,
    updateFnName: getUpdateFnNames(valueName)[0],
    updateFnProps: {},
    updateOverrides: [],
  });
}

export function updateVarb<VN extends ValueName>(
  valueName: VN,
  partial: Partial<UpdateVarb<VN>> = {}
): UpdateVarb<VN> {
  const { updateFnProps, updateOverrides, ...rest }: UpdateVarb<VN> = {
    ...defaultUpdateVarb(valueName),
    ...Obj.removeUndefined(partial),
  };
  return {
    ...rest,
    updateOverrides: collectOverrideSwitchProps(updateOverrides),
    updateFnProps: collectUpdateFnSwitchProps(updateFnProps),
  };
}

export type UpdateVarbOptions<VN extends ValueName> = Partial<UpdateVarb<VN>>;
export type SafeUpdateOptions<VN extends ValueName> =
  | StrictOmit<UpdateVarbOptions<VN>, "updateFnName">
  | StrictOmit<UpdateVarbOptions<"numObj">, "updateOverrides">;

export type NumObjOverrideVarbOptions = {
  switchInfo?: UpdateOverrideSwitchInfo;
  initValue?: NumObj;
};

type Extras<VN extends ValueName> = StrictOmit<
  UpdateVarb<VN>,
  "updateFnName" | "updateOverrides"
>;
type Options<VN extends ValueName> = Partial<Extras<VN>>;

export type LeftRightUpdateProps = [UpdateFnProp, UpdateFnProp];
export const updateVarbS = {
  input<VN extends ValueName>(
    valueName: VN,
    options?: Options<VN>
  ): UpdateVarb<VN> {
    const updateName =
      valueName === "numObj" ? "calcVarbs" : "manualUpdateOnly";
    return this.basic(valueName, updateName, options);
  },
  override<VN extends ValueName>(
    valueName: VN,
    updateOverrides: UpdateOverrides,
    options?: Options<VN>
  ): UpdateVarb<VN> {
    return updateVarb(valueName, {
      ...options,
      ...uosb(updateOverrides),
    });
  },
  basic<VN extends ValueName>(
    valueName: VN,
    updateFnName: UpdateFnName,
    options?: Options<VN>
  ) {
    return updateVarb(valueName, {
      ...options,
      updateFnName,
      updateOverrides: [],
    });
  },
  basic2<VN extends ValueName>(
    valueName: VN,
    basics: UpdateBasics<VN>,
    options?: Options<VN>
  ) {
    return updateVarb(valueName, { ...options, ...basics });
  },
  manualUpdate<VN extends ValueName>(valueName: VN, options?: Options<VN>) {
    return this.basic(valueName, "manualUpdateOnly", options);
  },
  numObjO(
    updateOverrides: UpdateOverrides,
    options?: Options<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.override("numObj", updateOverrides, options);
  },
  numObjB(
    updateFnName: UpdateFnName<"numObj">,
    options?: Options<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.basic("numObj", updateFnName, options);
  },
  numObjB2(basics: UpdateBasics<"numObj">, options?: Options<"numObj">) {
    return this.basic2("numObj", basics, options);
  },
  loadNumObjChild(childName: ChildName, varbName: VarbNameWide) {
    return this.numObjB2(ubS.loadChild(childName, varbName));
  },
  vsNumObj<VT extends ValueSourceType>(
    _valueSourceType: VT,
    overrideMap: Record<ValueSource<VT>, UpdateBasics>,
    options?: ValueSourceOptions
  ): UpdateVarb<"numObj"> {
    return this.numObjO(
      uosS.valueSource(
        _valueSourceType,
        overrideMap,
        options
      ) as UpdateOverrides<any>
    );
  },
  vsChildNumObj<VT extends ValueSourceType>(
    childName: ChildName,
    _valueSourceType: VT,
    overrideMap: Record<ValueSource<VT>, UpdateBasics>,
    options?: ValueSourceOptions
  ) {
    return this.vsNumObj(_valueSourceType, overrideMap, {
      switchInfo: relVarbInfoS.children(childName, "valueSourceName"),
      ...options,
    });
  },
  dealMode(
    overrideMap: DealModeBasics,
    { switchInfo, ...rest }: NumObjOverrideVarbOptions = {}
  ): UpdateVarb<"numObj"> {
    return this.numObjO(uosS.dealMode(overrideMap, { switchInfo }), rest);
  },
  get displayNameEditor() {
    return this.basic("string", "manualUpdateOnly");
  },
  one() {
    return this.basic("number", "numberOne", { initValue: 1 });
  },
  sumNums(
    nums: StandardUP[],
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.numObjB("sumNums", {
      ...options,
      ...ubS.sumNums(...nums),
    });
  },
  sumChildNums<SN extends SectionName, CN extends ChildName<SN>>(
    childName: CN,
    varbName: string
  ) {
    return this.sumNums([
      updatePropS.children(childName as ChildName, varbName),
    ]);
  },
  numEquation(
    updateFnName: NumPropCalcName,
    num: UpdateFnProp,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.numObjB(updateFnName, {
      ...options,
      ...ubS.equationSimple(updateFnName, num),
    });
  },
  divide(
    left: StandardUP,
    right: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.equationLR("divide", left, right, options);
  },
  multiply(
    left: StandardUP,
    right: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.equationLR("multiply", left, right, options);
  },
  add(
    left: StandardUP,
    right: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.equationLR("add", left, right, options);
  },
  subtract(
    left: StandardUP,
    right: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.equationLR("subtract", left, right, options);
  },
  decimalToPercent(
    decimal: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.numObjB2(ubS.decimalToPercent(decimal), options);
  },
  percentToDecimal(
    percent: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.numObjB2(ubS.percentToDecimal(percent), options);
  },
  equationLR(
    updateFnName: LeftRightPropCalcName,
    left: StandardUP,
    right: StandardUP,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return this.numObjB(updateFnName, {
      ...options,
      ...ubS.equationLR(updateFnName, left, right),
    });
  },
  completionStatusB(
    partialProps: Partial<CompletionStatusProps>
  ): UpdateVarb<"completionStatus"> {
    return this.basic("completionStatus", "completionStatus", {
      updateFnProps: upS.completionStatus(partialProps),
    });
  },
  completionStatusO(
    ...overrides: UpdateOverrides
  ): UpdateVarb<"completionStatus"> {
    return this.override("completionStatus", overrides, {
      initValue: "allEmpty",
    });
  },
};

export const uvS = updateVarbS;
