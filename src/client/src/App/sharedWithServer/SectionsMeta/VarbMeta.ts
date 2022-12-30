import { cloneDeep, pick } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { valueMeta } from "./baseSectionsDerived/valueMeta";
import {
  NumUnitName,
  numUnitParams,
} from "./baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { FixedInEntity } from "./baseSectionsVarbs/baseValues/entities";
import { ValueName } from "./baseSectionsVarbs/baseVarb";
import { relSections } from "./relSectionsVarbs";
import { UpdateFnName } from "./relSectionVarbs/rel/relVarb/UpdateFnName";
import { UpdateFnProps } from "./relSectionVarbs/rel/relVarb/UpdateFnProps";
import {
  UpdateOverride,
  UpdateOverrideProps,
} from "./relSectionVarbs/rel/relVarb/UpdateOverrides";
import { DisplayName, RelVarb } from "./relSectionVarbs/rel/relVarbTypes";
import { GeneralRelVarbs } from "./relSectionVarbs/relVarbs";
import { RelOutVarbInfo } from "./sectionChildrenDerived/RelInOutVarbInfo";
import { SectionMeta } from "./SectionMeta";
import { SectionName } from "./SectionName";

type InBaseUpdatePack = {
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
  fixedInEntities: FixedInEntity[];
};

type InDefaultUpdatePack = InBaseUpdatePack & {
  inverseSwitches: UpdateOverrideProps[];
};

type InSwitchUpdatePack = InBaseUpdatePack & UpdateOverrideProps;
export type InUpdatePack = InBaseUpdatePack | InSwitchUpdatePack;

type OutBaseUpdatePack = { relTargetVarbInfo: RelOutVarbInfo };
export type OutSwitchPack = OutBaseUpdatePack & UpdateOverrideProps;
export type OutDefaultPack = OutBaseUpdatePack & {
  inverseSwitches: UpdateOverrideProps[];
};
export function isDefaultOutPack(pack: OutUpdatePack): pack is OutDefaultPack {
  return "inverseSwitches" in pack;
}
export function isSwitchOutPack(pack: OutUpdatePack): pack is OutSwitchPack {
  return "switchInfo" in pack;
}
export type OutUpdatePack = OutSwitchPack | OutDefaultPack;
function fnPropsToFixedInEntities(
  updateFnProps: UpdateFnProps
): FixedInEntity[] {
  const infos = Object.values(updateFnProps);
  let nextInfos: FixedInEntity[] = [];
  for (const info of infos) {
    if (Array.isArray(info)) nextInfos = nextInfos.concat(info);
    else nextInfos.push(info);
  }
  return nextInfos;
}
function updateOverrideToInfos(
  updateOverride: UpdateOverride[]
): InSwitchUpdatePack[] {
  const inSwitchInfos: InSwitchUpdatePack[] = [];
  for (const prop of updateOverride) {
    const fixedInEntities = fnPropsToFixedInEntities(prop.updateFnProps);
    inSwitchInfos.push({
      ...prop,
      fixedInEntities,
    });
  }
  return inSwitchInfos;
}

interface VarbMetaProps<SN extends SectionName> {
  varbName: string;
  sectionName: SN;
  inSwitchUpdatePacks: InSwitchUpdatePack[];
  outUpdatePacks: OutUpdatePack[];
}

export type VarbMetaCore<SN extends SectionName> = RelVarb & VarbMetaProps<SN>;
export class VarbMeta<SN extends SectionName> {
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
  get displayNameStart(): string {
    return this.core.displayNameStart;
  }
  get displayNameEnd(): string {
    return this.core.displayNameEnd;
  }
  get displayNameFull(): string {
    return this.displayNameStart + this.displayName + this.displayNameEnd;
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
  get varbNameInfo(): VarbNames<SN> {
    return {
      sectionName: this.sectionName,
      varbName: this.varbName,
    };
  }
  get valueName(): ValueName {
    return this.core.type;
  }
  get inSwitchUpdatePacks(): InSwitchUpdatePack[] {
    return cloneDeep(this.core.inSwitchUpdatePacks);
  }
  get outUpdatePacks(): OutUpdatePack[] {
    return cloneDeep(this.core.outUpdatePacks);
  }
  get calcRound(): number {
    return numUnitParams[this.unit].calcRound;
  }
  get displayRound(): number {
    return numUnitParams[this.unit].displayRound;
  }
  get unit(): NumUnitName {
    if ("unit" in this.core) return this.core.unit;
    else throw new Error(`Varb with name ${this.core.varbName} has no numUnit`);
  }
  get inDefaultUpdatePack(): InDefaultUpdatePack {
    const { updateFnProps, updateFnName } = this.core;
    return {
      updateFnProps,
      updateFnName,
      fixedInEntities: fnPropsToFixedInEntities(updateFnProps),
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
  static init<SN extends SectionName>({
    sectionName,
    varbName,
  }: VarbNames<SN>): VarbMeta<SN> {
    const relVarbs = relSections[sectionName] as GeneralRelVarbs;
    const relVarb = relVarbs[varbName];
    return new VarbMeta({
      ...relVarb,
      sectionName,
      varbName,
      inSwitchUpdatePacks: updateOverrideToInfos(relVarb.updateOverrides),
      outUpdatePacks: [], // static after initialization
    });
  }
}
