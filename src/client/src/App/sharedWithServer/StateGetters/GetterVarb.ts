import { cloneDeep } from "lodash";
import {
  DbVarbInfoMixed,
  FeVarbInfoMixed,
  VarbNames,
} from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import {
  InEntity,
  OutEntity,
} from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { NumberOrQ } from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { ValueName } from "../SectionsMeta/baseSectionsUtils/baseVarb";
import { ExpectedCount } from "../SectionsMeta/baseSectionsUtils/NanoIdInfo";
import {
  Adornments,
  StateValueAnyKey,
  valueSchemasPlusAny,
  ValueTypesPlusAny,
} from "../SectionsMeta/baseSectionsUtils/StateVarbTypes";
import {
  mixedInfoS,
  VarbInfoMixedFocal,
} from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { RelLocalInfo } from "../SectionsMeta/childSectionsDerived/RelInfo";
import { InfoS, VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { InUpdatePack, VarbMeta } from "../SectionsMeta/VarbMeta";
import { RawFeVarb } from "../StateSections/StateSectionsTypes";
import { mathS, NotANumberError } from "../utils/math";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { GetterVarbNumObj } from "./GetterVarbNumObj";
import { GetterVarbs } from "./GetterVarbs";

class ValueTypeError extends Error {}

export class GetterVarb<
  SN extends SectionName<"hasVarb"> = SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private getterVarbs = new GetterVarbs(this.getterSectionProps);
  get numObj() {
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  get getterSection() {
    return new GetterSection(this.getterSectionProps);
  }
  get section() {
    return this.getterSection;
  }
  get sections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get meta(): VarbMeta<SN> {
    return this.sectionMeta.varb(this.varbName);
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
  get inEntities(): InEntity[] {
    const val = this.value("any");
    if (val && typeof val === "object" && "entities" in val) {
      return cloneDeep(val.entities);
    } else return [];
  }
  get numberValue(): number {
    const val = this.value("any");
    if (val && typeof val === "object" && "solvableText" in val) {
      const numString = this.numObj.solveTextToNumStringNext();
      return mathS.parseFloatStrict(numString);
    } else {
      return mathS.parseFloatStrict(`${this.value("any")}`);
    }
  }
  get numberOrZero(): number {
    try {
      return this.numberValue;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return 0;
      } else {
        throw ex;
      }
    }
  }
  get numberOrQuestionMark(): NumberOrQ {
    try {
      return this.numberValue;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return "?";
      } else {
        throw ex;
      }
    }
  }
  get feVarbInfoMixed(): FeVarbInfoMixed<SN> {
    const { sectionName, feId, varbName } = this.feVarbInfo;
    return mixedInfoS.makeFeVarb(sectionName, feId, varbName);
  }
  dbVarbInfoMixed<EC extends ExpectedCount>(
    expectedCount: EC
  ): DbVarbInfoMixed<SN, EC> {
    return {
      ...this.section.dbInfoMixed(expectedCount),
      varbName: this.varbName,
    };
  }
  get raw(): RawFeVarb<SN> {
    return this.sectionsShare.sections.rawVarb({
      ...this.feVarbInfo,
    });
  }
  get dbId() {
    return this.getterSection.dbId;
  }
  get varbId() {
    return GetterVarb.feVarbInfoToVarbId(this.feVarbInfo);
  }
  hasValueType<VT extends ValueName>(valueName: VT): boolean {
    try {
      this.value(valueName);
      return true;
    } catch (ex) {
      if (ex instanceof ValueTypeError) return false;
      else throw ex;
    }
  }
  value<VT extends ValueName | "any" = "any">(
    valueName?: VT
  ): ValueTypesPlusAny[VT] {
    const { value } = this.raw;
    if (valueSchemasPlusAny[valueName ?? "any"].is(value))
      return cloneDeep(value) as ValueTypesPlusAny[VT];
    throw new ValueTypeError(`Value not of type ${valueName}`);
  }

  get displayName(): string {
    const { displayName } = this.meta;
    if (typeof displayName === "string") return displayName;
    const displayNameVarb = this.section.varbByFocalMixed(displayName);
    return displayNameVarb.value("string");
  }
  get fullDisplayName(): string {
    const { displayNameEnd } = this.meta;
    return this.displayName + displayNameEnd;
  }
  get displayValue(): string {
    if (this.hasValueType("numObj")) {
      return `${this.numberOrQuestionMark}`;
    } else return `${this.value()}`;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<Adornments> = {}) {
    return `${startAdornment ?? this.meta.startAdornment}${this.displayValue}${
      endAdornment ?? this.meta.endAdornment
    }`;
  }
  localVarb(varbName: string) {
    return this.getterVarbs.one(varbName);
  }
  localValue<VT extends ValueName>(
    varbName: string,
    valueName?: VT
  ): ValueTypesPlusAny[VT] {
    return this.localVarb(varbName).value(valueName);
  }
  get updateFnName() {
    return this.inUpdatePack.updateFnName;
  }
  get updateFnProps() {
    return this.inUpdatePack.updateFnProps;
  }
  entityText(entityId: string) {
    const inEntity = this.inEntities.find(
      (entity) => entity.entityId === entityId
    );
    if (!inEntity)
      throw new Error(
        `inEntity with entityId ${entityId} not found at ${this.sectionName}.${this.varbName}`
      );

    const { editorText } = this.value("numObj");
    const { length, offset } = inEntity;
    return editorText.substring(offset, offset + length);
  }
  get inUpdatePack(): InUpdatePack {
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
  switchIsActive(relSwitchInfo: RelLocalInfo, switchValue: string): boolean {
    const actualSwitchValue = this.section
      .varbByFocalMixed(relSwitchInfo as VarbInfoMixedFocal)
      .value("string");
    return switchValue === actualSwitchValue;
  }
  getterVarb<S extends SectionName>(varbInfo: VarbInfo<S>): GetterVarb<S> {
    return new GetterVarb({
      ...varbInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  varbsByFocalMixed(multiVarbInfo: VarbInfoMixedFocal): GetterVarb[] {
    return this.section.varbsByFocalMixed(multiVarbInfo);
  }
  inputProps(valueName?: StateValueAnyKey) {
    return {
      id: this.varbName,
      name: this.varbName,
      value: this.value(valueName),
      label: this.displayName,
    };
  }
  nearestAnscestor<S extends SectionName>({
    sectionName,
    varbName,
  }: VarbNames<S>): GetterVarb<S> {
    const anscestor = this.getterSection.nearestAnscestor(sectionName);
    return anscestor.varb(varbName);
  }
  static feVarbInfoToVarbId(info: VarbInfo): string {
    const { sectionName, varbName, feId } = info;
    return [sectionName, varbName, feId].join(".");
  }
  static varbInfosToVarbIds(varbInfos: VarbInfo[]): string[] {
    return varbInfos.map((varbInfo) => {
      return GetterVarb.feVarbInfoToVarbId(varbInfo);
    });
  }
  static varbIdToVarbInfo(varbId: string): VarbInfo {
    const [sectionName, varbName, feId] = varbId.split(".") as [
      SectionName,
      string,
      string
    ];
    const info = { sectionName, varbName, feId };
    if (InfoS.isFeVarbInfo(info)) return info;
    else throw new Error(`Was passed an invalid varbId: ${varbId}`);
  }
}
