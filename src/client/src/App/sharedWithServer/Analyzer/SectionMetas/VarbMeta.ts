import { cloneDeep, pick } from "lodash";
import { NumObjUnit } from "../methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";
import { StateValue } from "../StateSection/StateVarb/stateValue";
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
import { valueMeta } from "./relSections/baseSections/baseValues";
import { NumObj } from "./relSections/baseSections/baseValues/NumObj";
import { UpdateFnName } from "./relSections/rel/valueMetaTypes";
import { AnySectionName } from "./relSections/baseSections";

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
type OutSwitchPack = OutBaseUpdatePack & SwitchUpdateInfo;
type OutDefaultPack = OutBaseUpdatePack & {
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
  isVarbValueType(value: any): boolean {
    return valueMeta[this.type].is(value);
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
  get unit(): NumObjUnit | undefined {
    return "unit" in this.core ? this.core.unit : undefined;
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
  //
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
