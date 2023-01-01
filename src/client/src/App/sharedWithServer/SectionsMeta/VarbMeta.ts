import { cloneDeep } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { valueMetas } from "./baseSectionsDerived/valueMetas";
import {
  NumUnitName,
  numUnitParams,
} from "./baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { FixedInEntity } from "./baseSectionsVarbs/baseValues/entities";
import { ValueName } from "./baseSectionsVarbs/baseVarb";
import { relSections } from "./relSectionsVarbs";
import { UpdateBasics } from "./relSectionVarbs/rel/relVarb/UpdateBasics";
import { UpdateFnProps } from "./relSectionVarbs/rel/relVarb/UpdateFnProps";
import {
  UpdateOverrides,
  UpdateOverrideSwitches,
} from "./relSectionVarbs/rel/relVarb/UpdateOverrides";
import { DisplayName, RelVarb } from "./relSectionVarbs/rel/relVarbTypes";
import { GeneralRelVarbs } from "./relSectionVarbs/relVarbs";
import { SectionMeta } from "./SectionMeta";
import { SectionName } from "./SectionName";

export type VarbMetaCore<SN extends SectionName> = RelVarb & {
  varbName: string;
  sectionName: SN;
  inSwitchUpdatePacks: InSwitchUpdatePack[];
};
export class VarbMeta<SN extends SectionName> {
  constructor(readonly core: VarbMetaCore<SN>) {}
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
    return this.core.valueName;
  }
  get inSwitchUpdatePacks(): InSwitchUpdatePack[] {
    return cloneDeep(this.core.inSwitchUpdatePacks);
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
  get inDefaultUpdatePack(): InUpdatePack {
    const { updateFnProps, updateFnName } = this.core;
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
    const relVarbs = relSections[sectionName] as GeneralRelVarbs;
    const relVarb = relVarbs[varbName];
    return new VarbMeta({
      ...relVarb,
      sectionName,
      varbName,
      inSwitchUpdatePacks: updateOverrideToInfos(relVarb.updateOverrides),
    });
  }
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
