import { cloneDeep, pick } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { SimpleSectionName } from "./baseSections";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { NumObjUnit } from "./baseSectionsUtils/baseValues/NumObj";
import { ValueName } from "./baseSectionsUtils/baseVarb";
import {
  RelInVarbInfo,
  RelOutVarbInfo,
} from "./childSectionsDerived/RelInOutVarbInfo";
import { relSections } from "./relSections";
import {
  DisplayName,
  RelVarb,
  SwitchUpdateInfo,
  UpdateFnProps,
  UpdateSwitchProp,
} from "./relSectionsUtils/rel/relVarbTypes";
import { GeneralRelVarbs } from "./relSectionsUtils/relVarbs";
import { valueMeta } from "./relSectionsUtils/valueMeta";
import { UpdateFnName } from "./relSectionsUtils/valueMetaTypes";
import { SectionMeta } from "./SectionMeta";

type InBaseUpdatePack = {
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
  inUpdateInfos: RelInVarbInfo[];
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

type OutBaseUpdatePack = { relTargetVarbInfo: RelOutVarbInfo };
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

function fnPropsToInVarbInfos(updateFnProps: UpdateFnProps): RelInVarbInfo[] {
  const infos = Object.values(updateFnProps);
  let nextInfos: RelInVarbInfo[] = [];
  for (const info of infos) {
    if (Array.isArray(info)) nextInfos = nextInfos.concat(info);
    else nextInfos.push(info);
  }
  return nextInfos;
}
function inSwitchPropsToInfos(
  inSwitchProps: UpdateSwitchProp[]
): InSwitchUpdatePack[] {
  const inSwitchInfos: InSwitchUpdatePack[] = [];
  for (const prop of inSwitchProps) {
    inSwitchInfos.push({
      ...prop,
      inUpdateInfos: fnPropsToInVarbInfos(prop.updateFnProps),
    });
  }
  return inSwitchInfos;
}

interface VarbMetaProps<SN extends SimpleSectionName> {
  varbName: string;
  sectionName: SN;
  inDefaultInfos: RelInVarbInfo[];
  InSwitchUpdatePacks: InSwitchUpdatePack[];
  outUpdatePacks: OutUpdatePack[];
}

export type VarbMetaCore<SN extends SimpleSectionName> = RelVarb &
  VarbMetaProps<SN>;
export class VarbMeta<SN extends SimpleSectionName> {
  constructor(readonly core: VarbMetaCore<SN>) {}
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
  get sectionMeta(): SectionMeta<any> {
    return sectionsMeta.section(this.sectionName);
  }
  get value() {
    return valueMeta[this.valueName];
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
  get displayName(): DisplayName {
    return this.core.displayName;
  }
  get displayNameEnd(): string {
    return this.core.displayNameEnd;
  }
  get initValue() {
    return cloneDeep(this.core.initValue);
  }
  get varbName(): string {
    return this.core.varbName;
  }
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get sectionVarbNames(): VarbNames<SN> {
    return {
      sectionName: this.sectionName,
      varbName: this.varbName,
    };
  }
  get valueName(): ValueName {
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
  static init<SN extends SimpleSectionName>({
    sectionName,
    varbName,
  }: VarbNames<SN>): VarbMeta<SN> {
    const relVarbs = relSections[sectionName].relVarbs as GeneralRelVarbs;
    const relVarb = relVarbs[varbName];
    return new VarbMeta({
      ...relVarb,
      sectionName,
      varbName,
      inDefaultInfos: fnPropsToInVarbInfos(relVarb.updateFnProps),
      InSwitchUpdatePacks: inSwitchPropsToInfos(relVarb.inUpdateSwitchProps),
      outUpdatePacks: [], // static after initialization
    });
  }
}
