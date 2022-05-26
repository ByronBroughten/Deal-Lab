import { SharedSections } from "../HasInfoProps/HasSharedSectionsProp";
import { HasVarbInfoProps } from "../HasInfoProps/HasVarbInfoProps";
import { FocalSectionBase } from "../SectionFocal/FocalSectionBase";
import { InEntity } from "../SectionsMeta/baseSections/baseValues/entities";
import { InfoS, VarbInfo } from "../SectionsMeta/Info";
import {
  FeVarbInfo,
  LocalRelVarbInfo,
  MultiVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { InUpdatePack, VarbMeta } from "../SectionsMeta/VarbMeta";
import FeVarb, { ValueTypesPlusAny } from "../SectionsState/FeSection/FeVarb";
import { GetterSectionProps } from "./GetterSection";

interface GetterVarbProps<SN extends SectionName<"hasVarb">>
  extends VarbInfo<SN> {
  shared: SharedSections;
}

class GetterVarbBase<
  SN extends SectionName<"hasVarb">
> extends HasVarbInfoProps<SN> {
  readonly shared: SharedSections;
  constructor(props: GetterVarbProps<SN>) {
    super(props);
    this.shared = props.shared;
  }
}

export interface FocalVarbGetterProps<SN extends SectionName>
  extends GetterSectionProps<SN> {
  varbName: string;
}

export class GetterVarb<
  SN extends SectionName<"hasVarb">
> extends FocalSectionBase<SN> {
  readonly varbName: string;
  constructor({ varbName, ...rest }: FocalVarbGetterProps<SN>) {
    super(rest);
    this.varbName = varbName;
  }
  get varb(): FeVarb {
    return this.self.varb(this.varbName);
  }
  get meta(): VarbMeta {
    return this.varb.meta;
  }
  get info(): VarbInfo<SN> {
    return {
      ...this.self.feInfo,
      varbName: this.varbName,
    };
  }
  get infoMixed(): FeVarbInfo<SN> {
    return InfoS.feToMixedVarb(this.info);
  }
  get inEntitites(): InEntity[] {
    return this.varb.inEntities;
  }
  varbsByFocal(multiInfo: MultiVarbInfo): FeVarb[] {
    return this.sections.varbsByFocal(this.infoMixed, multiInfo);
  }
  value<VT extends ValueTypeName>(valueType?: VT): ValueTypesPlusAny[VT] {
    return this.varb.value(valueType);
  }
  localValue<VT extends ValueTypeName>(
    varbName: string,
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.sections
      .varb({ ...this.self.feInfo, varbName })
      .value(valueType);
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
  private switchIsActive(
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    return (
      switchValue ===
      this.sections.varbByFocal(this.infoMixed, relSwitchInfo).value("string")
    );
  }
}