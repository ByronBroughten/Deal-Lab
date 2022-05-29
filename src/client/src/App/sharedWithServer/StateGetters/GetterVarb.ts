import { cloneDeep } from "lodash";
import {
  valueSchemasPlusAny,
  ValueTypesPlusAny,
} from "../FeSections/FeSection/FeVarb";
import { OutEntity } from "../FeSections/FeSection/FeVarb/entities";
import { InEntity } from "../SectionsMeta/baseSections/baseValues/entities";
import { NumObj } from "../SectionsMeta/baseSections/baseValues/NumObj";
import { InfoS, VarbInfo } from "../SectionsMeta/Info";
import {
  FeVarbInfo,
  LocalRelVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  DbValue,
  ValueTypeName,
} from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { cloneValue, InUpdatePack, VarbMeta } from "../SectionsMeta/VarbMeta";
import { RawFeVarb } from "../StateSections/StateSectionsNext";
import { GetterVarbBase, GetterVarbProps } from "./Bases/GetterVarbBase";
import { GetterVarbs } from "./GetterVarbs";

export class GetterVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private getterVarbs: GetterVarbs<SN>;
  constructor(props: GetterVarbProps<SN>) {
    super(props);
    this.getterVarbs = new GetterVarbs(props);
  }
  get meta(): VarbMeta {
    return this.getterVarbs.meta.get(this.varbName);
  }
  get feVarbInfo(): VarbInfo<SN> {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
  get outEntities(): OutEntity[] {
    return this.raw.outEntities;
  }
  get feVarbInfoMixed(): FeVarbInfo<SN> {
    return InfoS.feToMixedVarb(this.feVarbInfo);
  }
  get raw(): RawFeVarb<SN> {
    return this.sectionsShare.sections.rawVarb({
      ...this.feVarbInfo,
    });
  }
  get varbId() {
    return GetterVarb.feVarbInfoToFullName(this.feVarbInfo);
  }
  value<VT extends ValueTypeName | "any" = "any">(
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    const { value } = this.raw;
    if (valueSchemasPlusAny[valueType ?? "any"].is(value))
      return cloneValue(value) as ValueTypesPlusAny[VT];
    throw new Error(`Value not of type ${valueType}`);
  }
  get inEntities(): InEntity[] {
    const val = this.value("any");
    if (val instanceof NumObj) return cloneDeep(val.entities);
    else return [];
  }
  get displayName(): string {
    const { displayName } = this.meta;
    if (typeof displayName === "string") return displayName;
    const displayNameVarb = this.getterVarbs.varbByFocalMixed(displayName);
    return displayNameVarb.value("string");
  }
  get displayValue(): string {
    const value = this.value();
    if (value instanceof NumObj) return `${value.number}`;
    else return `${value}`;
  }
  localVarb(varbName: string) {
    return this.getterVarbs.one(varbName);
  }
  localValue<VT extends ValueTypeName>(
    varbName: string,
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.localVarb(varbName).value(valueType);
  }
  toDbValue(): DbValue {
    const value = this.value("any");
    if (value instanceof NumObj) {
      const dbValue = value.dbNumObj;
      return dbValue;
    } else return value;
  }
  get updateFnName() {
    return this.inUpdatePack.updateFnName;
  }
  get updateFnProps() {
    return this.inUpdatePack.updateFnProps;
  }
  private get inUpdatePack(): InUpdatePack {
    const {
      inSwitchUpdatePacks,
      defaultUpdateFnName,
      defaultInUpdateFnInfos,
      defaultUpdateFnProps,
    } = this.meta;
    for (const pack of inSwitchUpdatePacks) {
      const {
        switchInfo,
        switchValue,
        updateFnName,
        inUpdateInfos,
        updateFnProps,
      } = pack;
      if (this.switchIsActive(switchInfo, switchValue))
        return { updateFnName, updateFnProps, inUpdateInfos: inUpdateInfos };
    }
    return {
      updateFnName: defaultUpdateFnName,
      updateFnProps: defaultUpdateFnProps,
      inUpdateInfos: defaultInUpdateFnInfos,
    };
  }
  switchIsActive(
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    return (
      switchValue ===
      this.getterVarbs.varbByFocalMixed(relSwitchInfo).value("string")
    );
  }
  getterVarb<S extends SectionName>(varbInfo: VarbInfo<S>): GetterVarb<S> {
    return new GetterVarb({
      ...varbInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  static feVarbInfoToFullName(info: VarbInfo): string {
    const { sectionName, varbName, feId } = info;
    return [sectionName, varbName, feId].join(".");
  }
}
