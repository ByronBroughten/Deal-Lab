import { cloneDeep, round } from "lodash";
import { DisplayOverrideSwitches } from "../SectionsMeta/allDisplaySectionVarbs";
import {
  DbVarbInfoMixed,
  FeVarbInfoMixed,
  VarbNames,
} from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { NumberOrQ } from "../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { ExpectedCount } from "../SectionsMeta/baseSectionsVarbs/NanoIdInfo";
import {
  Adornments,
  StateValueAnyKey,
  valueSchemasPlusAny,
  ValueTypesPlusAny,
} from "../SectionsMeta/baseSectionsVarbs/StateVarbTypes";
import { ValueName } from "../SectionsMeta/baseSectionsVarbs/ValueName";
import {
  mixedInfoS,
  VarbInfoMixedFocal,
} from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { FeInfoS, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { relVarbInfoS } from "../SectionsMeta/SectionInfo/RelVarbInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { VarbMeta } from "../SectionsMeta/VarbMeta";
import { StateVarb } from "../StateSections/StateSectionsTypes";
import { mathS, NotANumberError } from "../utils/math";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { GetterVarbNumObj } from "./GetterVarbNumObj";

class ValueTypeError extends Error {}

export class GetterVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
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
  get feVarbInfo(): FeVarbInfo<SN> {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
  get numberValue(): number {
    // figure out how to make NaN result in an error or questionMark
    const val = this.value("any");
    if (val && typeof val === "object" && "solvableText" in val) {
      const numString = this.numObj.solveTextToNumStringNext();
      return mathS.parseFloatStrict(numString);
    } else {
      return mathS.parseFloatStrict(`${val}`);
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
  get displayNumber(): NumberOrQ {
    const num = this.numberOrQuestionMark;
    if (typeof num === "number") {
      return round(num, this.meta.displayRound);
    } else return num;
  }
  get numberOrQuestionMark(): NumberOrQ {
    try {
      let val = this.numberValue;
      if (`${val}` === "NaN") {
        throw new Error("no NaN allowed");
      }
      return val;
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
  get raw(): StateVarb<SN> {
    return this.sectionsShare.sections.rawVarb({
      ...this.feVarbInfo,
    });
  }
  get isPureUserVarb(): boolean {
    return this.raw.isPureUserVarb;
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
    if (valueSchemasPlusAny[valueName ?? "any"].is(value)) {
      return cloneDeep(value) as ValueTypesPlusAny[VT];
    } else {
      throw new ValueTypeError(
        `Value of ${this.sectionName}.${this.varbName} not of type ${valueName}`
      );
    }
  }
  valueNext() {
    const value = this.value();
    if (this.meta.isVarbValueType(value)) {
      return value;
    } else {
      throw new Error(`value ${value} is not of type ${this.meta.valueName}`);
    }
  }
  get valueName(): ValueName {
    return this.meta.valueName;
  }
  get displaySource(): GetterVarb<any> {
    let source: GetterVarb<any> = this;
    let finder = this.meta.displaySourceFinder;

    let reps = 0;
    while (finder !== null) {
      if (relVarbInfoS.isLocal(finder)) {
        source = this.section.varbByFocalMixed(finder);
      } else if (Array.isArray(finder)) {
        for (const override of finder as DisplayOverrideSwitches) {
          const switchVarb = this.section.varbByFocalMixed(override.switchInfo);
          const switchValue = switchVarb.value("string");
          if (override.switchValue === switchValue) {
            source = this.section.varbByFocalMixed(override.sourceInfo);
          }
        }
      }
      finder = source.meta.displaySourceFinder;
      reps += 1;
      if (reps > 3) {
        throw new Error(
          "varbs shouldn't have many stacked sources for their displayVarb information"
        );
      }
    }
    return source;
  }
  get displayMeta(): VarbMeta<any> {
    return this.displaySource.meta;
  }
  get displayInfo() {
    const { displayMeta } = this;
    // this isn't great.
    return {
      displayName: displayMeta.displayName as string,
      displayNameEnd: displayMeta.displayNameEnd,
      displayNameStart: displayMeta.displayNameStart,
      startAdornment: displayMeta.startAdornment,
      endAdornment: displayMeta.endAdornment,
    };
  }
  get displayName(): string {
    const { displayName } = this.displayMeta;
    if (typeof displayName === "string") {
      return displayName;
    } else {
      return this.section.varbByFocalMixed(displayName).value("stringObj")
        .mainText;
    }
  }
  get displayNameFull(): string {
    return this.displayMeta.displayNameFull;
  }
  get displayNameStart(): string {
    return this.displayMeta.displayNameStart;
  }
  get sectionDotVarbName() {
    return `${this.sectionName}.${this.varbName}`;
  }
  get displayNameEnd(): string {
    return this.displayMeta.displayNameEnd;
  }
  get startAdornment(): string {
    return this.displayMeta.startAdornment;
  }
  get endAdornment(): string {
    return this.displayMeta.endAdornment;
  }
  get displayValue(): string {
    if (this.hasValueType("numObj")) {
      return `${this.displayNumber}`;
    } else return `${this.value()}`;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<Adornments> = {}) {
    const { displayMeta } = this;
    return `${startAdornment ?? displayMeta.startAdornment}${
      this.displayValue
    }${endAdornment ?? displayMeta.endAdornment}`;
  }
  localVarb(varbName: string) {
    return this.getterSection.varb(varbName);
  }
  localValue<VT extends ValueName>(
    varbName: string,
    valueName?: VT
  ): ValueTypesPlusAny[VT] {
    return this.localVarb(varbName).value(valueName);
  }
  getterVarb<S extends SectionNameByType>(
    varbInfo: FeVarbInfo<S>
  ): GetterVarb<S> {
    return new GetterVarb({
      ...this.getterSectionsProps,
      ...varbInfo,
    });
  }
  varbsByFocalMixed(multiVarbInfo: VarbInfoMixedFocal): GetterVarb[] {
    return this.section.varbsByFocalMixed(multiVarbInfo);
  }
  inputProps(valueName?: StateValueAnyKey): {
    id: string;
    name: string;
    value: StateValue;
    label: string;
  } {
    return {
      id: this.varbName,
      name: this.varbName,
      value: this.value(valueName),
      label: this.displayName,
    };
  }
  nearestAnscestor<S extends SectionNameByType>({
    sectionName,
    varbName,
  }: VarbNames<S>): GetterVarb<S> {
    const anscestor = this.getterSection.nearestAnscestor(sectionName);
    return anscestor.varb(varbName);
  }
  static feVarbInfoToVarbId(info: FeVarbInfo): string {
    const { sectionName, varbName, feId } = info;
    return [sectionName, varbName, feId].join(".");
  }
  static varbInfosToVarbIds(varbInfos: FeVarbInfo[]): string[] {
    return varbInfos.map((varbInfo) => {
      return GetterVarb.feVarbInfoToVarbId(varbInfo);
    });
  }
  static varbIdToVarbInfo(varbId: string): FeVarbInfo {
    const [sectionName, varbName, feId] = varbId.split(".") as [
      SectionNameByType,
      string,
      string
    ];
    const info = { sectionName, varbName, feId };
    if (FeInfoS.isVarbInfo(info)) return info;
    else throw new Error(`Was passed an invalid varbId: ${varbId}`);
  }
}
