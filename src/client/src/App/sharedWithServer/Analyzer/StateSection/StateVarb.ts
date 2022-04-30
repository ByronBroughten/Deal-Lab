import { cloneDeep, isEqual } from "lodash";
import { sectionMetas } from "../../SectionMetas";
import { valueMeta } from "../../SectionMetas/baseSections/baseValues";
import {
  InEntities,
  InEntity,
} from "../../SectionMetas/baseSections/baseValues/entities";
import { NumObj } from "../../SectionMetas/baseSections/baseValues/NumObj";
import { InfoS } from "../../SectionMetas/Info";
import {
  FeNameInfo,
  FeVarbInfo,
  RelVarbInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { DisplayName } from "../../SectionMetas/relSections/rel/relVarbTypes";
import {
  DbValue,
  UpdateFnName,
  ValueTypes,
} from "../../SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { cloneValue } from "../../SectionMetas/VarbMeta";
import array from "../../utils/Arr";
import {
  addInEntity,
  addOutEntity,
  findInEntity,
  OutEntity,
  removeInEntity,
  removeOutEntity,
  setInEntities,
} from "./StateVarb/entities";
import { initStateVarb } from "./StateVarb/init";
import { StateValue } from "./StateVarb/stateValue";

export type NextStateVarbCore = {
  varbName: string;
  sectionName: SectionName;
  feId: string;
  value: StateValue;
  outEntities: OutEntity[];
  manualUpdateEditorToggle: boolean | undefined; // filled with stateManager to ensure rerenders upon loading varbs
};

export type InVarbInfo = InEntity | FeVarbInfo;
type StateVarbCore = {
  feId: string;
  value: StateValue;
  outEntities: OutEntity[];
  manualUpdateEditorToggle: boolean | undefined; // filled with stateManager to ensure rerenders upon loading varbs
};
export type Adornments = {
  startAdornment: string;
  endAdornment: string;
};

export type StateVarbOptions = Partial<StateVarbCore>;

export type ValueTypesPlusAny = ValueTypes & { any: StateValue };
export const valueSchemasPlusAny = {
  ...valueMeta,
  any: { is: () => true },
} as const;

export type StateValueAnyKey = keyof ValueTypesPlusAny;
export default class StateVarb {
  constructor(protected core: NextStateVarbCore) {}
  get meta() {
    return sectionMetas.varb({ ...this.core }, "fe");
  }
  update(props: Partial<StateVarbCore>) {
    return new StateVarb({
      ...this.core,
      ...props,
    });
  }
  updateValue(newValue: StateValue, wasUpdatedByEditor: boolean) {
    return this.update({
      value: newValue,
      manualUpdateEditorToggle:
        this.nextManualUpdateEditorToggle(wasUpdatedByEditor),
    });
  }
  nextManualUpdateEditorToggle(wasUpdatedByEditor: boolean) {
    const current = this.manualUpdateEditorToggle;
    return wasUpdatedByEditor ? current : !current;
  }

  get fullName(): string {
    return StateVarb.feVarbInfoToFullName(this.feVarbInfo);
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
  get outEntities(): OutEntity[] {
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
    return StateVarb.feVarbInfoToFullName(this.feVarbInfo);
  }
  get name(): string {
    return this.stringFeVarbInfo;
  }
  inputProps(valueType?: StateValueAnyKey) {
    return {
      id: this.name,
      name: this.name,
      value: this.value(valueType),
      label: this.displayName,
    };
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

  toDbValue(): DbValue {
    const value = this.value("any");
    if (value instanceof NumObj) {
      const dbValue = value.dbNumObj;
      return dbValue;
    } else return value;
  }

  static init = initStateVarb;
  static feVarbInfoToFullName(info: FeVarbInfo): string {
    const { sectionName, varbName, id } = info;
    return [sectionName, varbName, id].join(".");
  }
  static fullNameToFeVarbInfo(fullName: string): FeVarbInfo {
    const [sectionName, varbName, id] = fullName.split(".") as [
      SectionName,
      string,
      string
    ];
    const info = { sectionName, varbName, id, idType: "feId" };
    if (InfoS.is.feVarb(info)) return info;
    else throw new Error(`Was passed an invalid fullName: ${fullName}`);
  }

  // entities
  findInEntity = findInEntity;
  addInEntity = addInEntity;
  removeInEntity = removeInEntity;
  removeOutEntity = removeOutEntity;
  addOutEntity = addOutEntity;
  setInEntities = setInEntities;
}
