import { cloneDeep, isEqual } from "lodash";
import { DbValue } from "../DbEntry";
import array from "../../utils/Arr";
import { sectionMetas } from "../SectionMetas";
import { baseValues } from "../SectionMetas/relSections/baseSections/baseValues";
import { NumObj } from "../SectionMetas/relSections/baseSections/baseValues/NumObj";
import {
  InEntities,
  InEntity,
} from "../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";
import {
  UpdateFnName,
  ValueTypes,
} from "../SectionMetas/relSections/rel/valueMetaTypes";
import {
  FeNameInfo,
  FeVarbInfo,
  RelVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { DisplayName } from "../SectionMetas/relSections/rel/relVarb/UpdateInfoArr";
import { SectionName } from "../SectionMetas/SectionName";
import { cloneValue, VarbMeta } from "../SectionMetas/VarbMeta";
import {
  addInEntity,
  addOutEntity,
  findInEntity,
  OutEntities,
  removeInEntity,
  removeOutEntity,
  setInEntities,
} from "./StateVarb/entities";
import { StateValue } from "./StateVarb/stateValue";
import { NumObjUnit } from "../methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";

export type InVarbInfo = InEntity | FeVarbInfo;
export type StateVarbCore = {
  feId: string;
  value: StateValue;
  outEntities: OutEntities;
  manualUpdateEditorToggle: boolean | undefined; // filled with stateManager to ensure rerenders upon loading varbs
};
export type Adornments = {
  startAdornment: string;
  endAdornment: string;
};

export type StateVarbOptions = Partial<StateVarbCore>;

export type ValueTypesPlusAny = ValueTypes & { any: StateValue };
export const valueSchemasPlusAny = {
  ...baseValues,
  any: { is: () => true },
} as const;

export type StateValueAnyKey = keyof ValueTypesPlusAny;
export default class StateVarb {
  constructor(protected core: StateVarbCore, readonly meta: VarbMeta) {}
  updateProps(props: Partial<StateVarbCore>) {
    return new StateVarb(
      {
        ...this.core,
        ...props,
      },
      this.meta
    );
  }
  nextManualUpdateEditorToggle(wasUpdatedByEditor: boolean) {
    const current = this.manualUpdateEditorToggle;
    return wasUpdatedByEditor ? current : !current;
  }
  get fullName(): string {
    return StateVarb.varbInfoToString(this.feVarbInfo);
  }
  get varbName() {
    return this.meta.varbName;
  }
  get feId() {
    return this.core.feId;
  }
  get sectionName() {
    return this.meta.sectionName;
  }
  get unit(): NumObjUnit {
    const metaCore = this.meta.core;
    if ("unit" in metaCore) return metaCore.unit;
    else throw new Error("This varb has no unit.");
  }
  get manualUpdateEditorToggle() {
    return this.core.manualUpdateEditorToggle;
  }
  is(valueType: StateValueAnyKey) {
    return valueSchemasPlusAny[valueType].is(this.core.value);
  }
  value<T extends StateValueAnyKey>(valueType?: T): ValueTypesPlusAny[T];
  value(valueType: StateValueAnyKey = "any") {
    // why do I return the numObj?

    if (
      valueType === "any" ||
      valueSchemasPlusAny[valueType].is(this.core.value)
    ) {
      return cloneValue(this.core.value);
    } else {
      throw new Error(`Value not of type ${valueType}`);
    }
  }
  get inEntities(): InEntities {
    const val = this.core.value;
    if (val instanceof NumObj) return cloneDeep(val.entities);
    else return [];
  }
  get outEntities(): OutEntities {
    return cloneDeep(this.core.outEntities);
  }

  get displayName(): DisplayName {
    return this.meta.displayName;
  }
  get displayValue(): string {
    const value = this.value();
    if (value instanceof NumObj) return `${value.number}`;
    else return `${value}`;
  }
  get feInfo(): FeNameInfo {
    return {
      sectionName: this.sectionName,
      id: this.feId,
      idType: "feId",
    };
  }
  get stringFeVarbInfo(): string {
    return StateVarb.varbInfoToString(this.feVarbInfo);
  }

  get feVarbInfo(): FeVarbInfo {
    return {
      ...this.feInfo,
      varbName: this.varbName,
    } as FeVarbInfo;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<Adornments> = {}) {
    return `${startAdornment ?? this.meta.startAdornment}${this.displayValue}${
      endAdornment ?? this.meta.endAdornment
    }`;
  }
  get solvableText() {
    return this.value("numObj").solvableText;
  }
  updateInfos(switchInfo: FeVarbInfo | null) {
    return {
      updateFnName: this.updateFnName(switchInfo),
      inVarbInfos: this.updateFnName(switchInfo),
    };
  }
  updateFnName(switchInfo: null | FeVarbInfo): UpdateFnName {
    if (switchInfo === null) return this.meta.defaultUpdateFnName;
    const pack = array.findIn(this.meta.inSwitchUpdatePacks, (pack) => {
      return isEqual(pack.switchInfo, switchInfo);
    });
    if (pack) return pack.updateFnName;
    else
      throw new Error(
        `inSwitchUpdatePacks doesn't have a switchInfo like this: ${switchInfo}`
      );
  }
  inVarbInfos(switchInfo: FeVarbInfo | null): RelVarbInfo[] {
    if (switchInfo === null) return this.meta.defaultInUpdateFnInfos;
    const pack = array.findIn(this.meta.inSwitchUpdatePacks, (pack) => {
      return isEqual(pack.switchInfo, switchInfo);
    });
    if (pack) return pack.inUpdateInfos;
    else
      throw new Error(
        `inSwitchUpdatePacks doesn't have a switchInfo like this: ${switchInfo}`
      );
  }
  get outUpdatePacks() {
    return this.meta.outUpdatePacks;
  }
  getErrorMessage() {
    const { displayName } = this;
    const value = this.value();
    if (value instanceof NumObj && value.editorTextStatus === "empty") {
      return `The ${displayName} field is empty.`;
    } else {
      return `The ${displayName} field entry is invalid.`;
    }
  }
  getFailedInfo() {
    return { errorMessage: this.getErrorMessage() };
  }

  // value
  updateValue(newValue: StateValue, wasUpdatedByEditor: boolean) {
    return new StateVarb(
      {
        ...this.core,
        value: newValue,
        manualUpdateEditorToggle:
          this.nextManualUpdateEditorToggle(wasUpdatedByEditor),
      },
      this.meta
    );
  }
  toDbValue(): DbValue {
    const value = this.value("any");
    if (value instanceof NumObj) return value.dbNumObj;
    else return value;
  }
  static init(
    { id, sectionName, varbName }: FeVarbInfo,
    options: StateVarbOptions = {}
  ): StateVarb {
    const meta = sectionMetas.varbMeta({ sectionName, varbName });
    return new StateVarb(
      {
        outEntities: [],
        manualUpdateEditorToggle: undefined,
        value: meta.initValue,
        ...options,
        feId: id,
      },
      meta
    );
  }

  static varbInfoToString(info: FeVarbInfo): string {
    const { sectionName, varbName, id } = info;
    return [sectionName, varbName, id].join(".");
  }
  static stringToVarbInfo(info: string): FeVarbInfo {
    const [sectionName, varbName, id] = info.split(".") as [
      SectionName,
      string,
      string
    ];
    return { sectionName, varbName, id, idType: "feId" } as FeVarbInfo;
  }

  // entities
  findInEntity = findInEntity;
  addInEntity = addInEntity;
  removeInEntity = removeInEntity;
  removeOutEntity = removeOutEntity;
  addOutEntity = addOutEntity;
  setInEntities = setInEntities;
}
