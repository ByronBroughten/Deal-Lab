import { cloneDeep, pick } from "lodash";
import { StateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { NumObjUnit } from "../StateSolvers/SolveValueVarb/solveText";
import { AnySectionName } from "./baseSections";
import { valueMeta } from "./baseSections/baseValues";
import { NumObj } from "./baseSections/baseValues/NumObj";
import {
  InRelVarbInfo,
  OutRelVarbInfo,
} from "./relSections/rel/relVarbInfoTypes";
import {
  RelVarb,
  SwitchUpdateInfo,
  UpdateFnProps,
  UpdateSwitchProp,
} from "./relSections/rel/relVarbTypes";
import { UpdateFnName } from "./relSections/rel/valueMetaTypes";

export type InBaseUpdatePack = {
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
  inUpdateInfos: InRelVarbInfo[];
};
type InDefaultUpdatePack = InBaseUpdatePack & {
  inverseSwitches: SwitchUpdateInfo[];
};
export function isDefaultInPack(
  pack: InUpdatePack
): pack is InDefaultUpdatePack {
  return "inverseSwitches" in pack;
}
export function isSwitchInPack(pack: InUpdatePack): pack is InSwitchUpdatePack {
  return "switchInfo" in pack;
}

type InSwitchUpdatePack = InBaseUpdatePack & SwitchUpdateInfo;
export type InUpdatePack = InBaseUpdatePack | InSwitchUpdatePack;

type OutBaseUpdatePack = { relTargetVarbInfo: OutRelVarbInfo };
export type OutSwitchPack = OutBaseUpdatePack & SwitchUpdateInfo;
export type OutDefaultPack = OutBaseUpdatePack & {
  inverseSwitches: SwitchUpdateInfo[];
};
export function isDefaultOutPack(pack: OutUpdatePack): pack is OutDefaultPack {
  return "inverseSwitches" in pack;
}
export function isSwitchOutPack(pack: OutUpdatePack): pack is OutSwitchPack {
  return "switchInfo" in pack;
}
export type OutUpdatePack = OutSwitchPack | OutDefaultPack;

function fnPropsToInVarbInfos(updateFnProps: UpdateFnProps): InRelVarbInfo[] {
  const infos = Object.values(updateFnProps);
  let nextInfos: InRelVarbInfo[] = [];
  for (const info of infos) {
    if (Array.isArray(info)) nextInfos = nextInfos.concat(info);
    else nextInfos.push(info);
  }
  return nextInfos;
}
function inSwitchPropsToInfos(inSwitchProps: UpdateSwitchProp[]) {
  const inSwitchInfos: InSwitchUpdatePack[] = [];
  for (const prop of inSwitchProps) {
    inSwitchInfos.push({
      ...prop,
      inUpdateInfos: fnPropsToInVarbInfos(prop.updateFnProps),
    });
  }
  return inSwitchInfos;
}

export interface VarbMetaProps {
  varbName: string;
  sectionName: AnySectionName;
  inDefaultInfos: InRelVarbInfo[];
  InSwitchUpdatePacks: InSwitchUpdatePack[];
  outUpdatePacks: OutUpdatePack[];
}

export function cloneValue(value: StateValue): StateValue {
  return value instanceof NumObj
    ? value.clone()
    : Array.isArray(value)
    ? [...value]
    : value;
}

export type VarbMetaCore = RelVarb & VarbMetaProps;
export class VarbMeta {
  constructor(readonly core: VarbMetaCore) {}
  validateVarbValue(value: any): true {
    if (this.isVarbValueType(value)) return true;
    else
      throw new Error(
        `value of "${value}" does not match the varb value type.`
      );
  }
  isVarbValueType(value: any): boolean {
    return this.value.is(value);
  }
  get value() {
    return valueMeta[this.type];
  }
  get<PN extends keyof VarbMetaCore>(propName: PN) {
    return this.core[propName];
  }
  get raw() {
    return { ...this.core };
  }
  get fullName(): string {
    const { sectionName, varbName } = this.core;
    return `${sectionName}.${varbName}`;
  }
  get updateFnProps() {
    return cloneDeep(this.core.updateFnProps);
  }
  get startAdornment() {
    return this.core.startAdornment ?? "";
  }
  get endAdornment() {
    return this.core.endAdornment ?? "";
  }
  get displayName() {
    return this.core.displayName;
  }
  get initValue() {
    return cloneValue(this.core.initValue);
  }
  get dbInitValue() {
    return cloneDeep(this.core.dbInitValue);
  }
  get varbName() {
    return this.core.varbName;
  }
  get sectionName() {
    return this.core.sectionName;
  }
  get type() {
    return this.core.type;
  }
  get defaultUpdateFnProps() {
    return this.core.updateFnProps;
  }
  get defaultUpdateFnName() {
    return this.core.updateFnName;
  }
  get defaultInUpdateFnInfos() {
    return this.core.inDefaultInfos;
  }
  get inSwitchUpdatePacks(): InSwitchUpdatePack[] {
    return cloneDeep(this.core.InSwitchUpdatePacks);
  }
  get outUpdatePacks(): OutUpdatePack[] {
    return cloneDeep(this.core.outUpdatePacks);
  }
  get inUpdatePacks(): InUpdatePack[] {
    return [...this.inSwitchUpdatePacks, this.inDefaultUpdatePack];
  }
  get unit(): NumObjUnit {
    if ("unit" in this.core) return this.core.unit;
    else
      throw new Error(`Varb with name ${this.core.varbName} has no NumObjUnit`);
  }
  get inDefaultUpdatePack(): InDefaultUpdatePack {
    return {
      updateFnProps: this.core.updateFnProps,
      updateFnName: this.core.updateFnName,
      inUpdateInfos: this.core.inDefaultInfos,
      inverseSwitches: this.inSwitchUpdatePacks.map((pack) =>
        pick(pack, ["switchInfo", "switchValue"])
      ),
    };
  }
  static isSwitchOutPack(pack: OutUpdatePack): pack is OutSwitchPack {
    return "switchInfo" in pack;
  }
  static isDefaultOutPack(pack: OutUpdatePack): pack is OutDefaultPack {
    return "inverseSwitches" in pack;
  }
  static isDefaultInPack(pack: InUpdatePack): pack is InDefaultUpdatePack {
    return "inverseSwitches" in pack;
  }

  static initCore(
    relVarb: RelVarb,
    sectionName: AnySectionName,
    varbName: string
  ): VarbMetaCore {
    return {
      ...relVarb,
      sectionName,
      varbName,
      inDefaultInfos: fnPropsToInVarbInfos(relVarb.updateFnProps),
      InSwitchUpdatePacks: inSwitchPropsToInfos(relVarb.inUpdateSwitchProps),
      outUpdatePacks: [], // static after initialization
    };
  }
}
