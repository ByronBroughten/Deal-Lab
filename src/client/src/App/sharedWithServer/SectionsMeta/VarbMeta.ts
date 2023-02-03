import { cloneDeep } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { FixedInEntity } from "./allBaseSectionVarbs/baseValues/entities";
import { GeneralBaseVarb } from "./allBaseSectionVarbs/baseVarbs";
import { ValueName } from "./allBaseSectionVarbs/ValueName";
import { getDisplayVarb } from "./allDisplaySectionVarbs";
import { allUpdateSections, getUpdateVarb } from "./allUpdateSectionVarbs";
import {
  getBaseVarb,
  VarbName,
} from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { valueMetas } from "./baseSectionsDerived/valueMetas";
import {
  DisplayName,
  DisplaySourceFinder,
} from "./displaySectionVarbs/displayVarb";
import { SectionMeta } from "./SectionMeta";
import { SectionName } from "./SectionName";
import { GeneralUpdateSectionVarbs } from "./updateSectionVarbs/updateSectionVarbs";
import { GeneralUpdateVarb } from "./updateSectionVarbs/updateVarb";
import { UpdateBasics } from "./updateSectionVarbs/updateVarb/UpdateBasics";
import { UpdateFnProps } from "./updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  UpdateOverrides,
  UpdateOverrideSwitches,
} from "./updateSectionVarbs/updateVarb/UpdateOverrides";

export type VarbMetaCore<SN extends SectionName> = {
  varbName: string;
  sectionName: SN;
  inSwitchUpdatePacks: InSwitchUpdatePack[];
};
export class VarbMeta<SN extends SectionName> {
  constructor(readonly core: VarbMetaCore<SN>) {}
  get varbName(): string {
    return this.core.varbName;
  }
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get baseVarb(): GeneralBaseVarb {
    return getBaseVarb(
      this.sectionName,
      this.varbName as VarbName<SN>
    ) as any as GeneralBaseVarb;
  }
  get displayVarb() {
    return getDisplayVarb(this.sectionName, this.varbName as VarbName<SN>);
  }
  get updateVarb(): GeneralUpdateVarb {
    return getUpdateVarb(
      this.sectionName,
      this.varbName as VarbName<SN>
    ) as any as GeneralUpdateVarb;
  }
  validateValue(value: any): true {
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
    const valueMeta = valueMetas[this.valueName];
    if (valueMeta === undefined) {
      throw new Error(`There is no valueMeta of valueName ${this.valueName}`);
    } else return valueMeta;
  }
  get fullName(): string {
    const { sectionName, varbName } = this.core;
    return `${sectionName}.${varbName}`;
  }
  get updateFnProps() {
    return cloneDeep(this.updateVarb.updateFnProps);
  }
  get startAdornment() {
    return this.displayVarb.startAdornment;
  }
  get endAdornment() {
    return this.displayVarb.endAdornment;
  }
  get displayName(): DisplayName {
    return this.displayVarb.displayName;
  }
  get displayNameStart(): string {
    return this.displayVarb.displayNameStart;
  }
  get displayNameEnd(): string {
    return this.displayVarb.displayNameEnd;
  }
  get displayNameFull(): string {
    return this.displayNameStart + this.displayName + this.displayNameEnd;
  }
  get initValue() {
    return cloneDeep(this.updateVarb.initValue);
  }
  get displaySourceFinder(): DisplaySourceFinder {
    return this.displayVarb.displaySourceFinder;
  }
  get varbNameInfo(): VarbNames<SN> {
    return {
      sectionName: this.sectionName,
      varbName: this.varbName,
    };
  }
  get valueName(): ValueName {
    return this.baseVarb.valueName;
  }
  get inSwitchUpdatePacks(): InSwitchUpdatePack[] {
    return cloneDeep(this.core.inSwitchUpdatePacks);
  }
  get calcRound(): number {
    return this.displayVarb.calculateRound;
  }
  get displayRound(): number {
    return this.displayVarb.displayRound;
  }
  get inDefaultUpdatePack(): InUpdatePack {
    const { updateFnProps, updateFnName } = this.updateVarb;
    return {
      updateFnProps,
      updateFnName,
      fixedInEntities: fnPropsToFixedInEntities(updateFnProps),
    };
  }
  static init<SN extends SectionName>({
    sectionName,
    varbName,
  }: VarbNames<SN>): VarbMeta<SN> {
    const relVarbs = allUpdateSections[
      sectionName
    ] as GeneralUpdateSectionVarbs;
    const updateVarb = relVarbs[varbName];
    return new VarbMeta({
      ...updateVarb,
      sectionName,
      varbName,
      inSwitchUpdatePacks: updateOverrideToInfos(updateVarb.updateOverrides),
    });
  }
}

export function getVarbMeta<SN extends SectionName>({
  sectionName,
  varbName,
}: VarbNames<SN>) {
  return VarbMeta.init({
    sectionName,
    varbName: varbName as string,
  });
}

export interface InUpdatePack extends UpdateBasics {
  fixedInEntities: FixedInEntity[];
}
interface InSwitchUpdatePack extends InUpdatePack {
  switches: UpdateOverrideSwitches;
}

function updateOverrideToInfos(
  updateOverride: UpdateOverrides
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
