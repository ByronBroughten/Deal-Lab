import { clone } from "lodash";
import {
  getVarbLabels,
  LabelOverrideSwitches,
  VarbInfoTextProps,
  VarbLabel,
} from "../../varbLabels/varbLabels";
import { SectionNameByType } from "../SectionNameByType";
import { StateVarb } from "../State/StateSectionsTypes";
import { VarbMeta } from "../StateMeta/VarbMeta";
import { DisplayOverrideSwitches } from "../stateSchemas/allDisplaySectionVarbs/displayVarb";
import {
  StateValue,
  StateValueOrAny,
  ValueNameOrAny,
} from "../stateSchemas/StateValue";
import { StrAdornments } from "../stateSchemas/StateValue/EditorValue";
import {
  notApplicableString,
  NumberOrQ,
  NumObjOutput,
} from "../stateSchemas/StateValue/NumObj";
import { switchValueNames } from "../stateSchemas/StateValue/unionValues";
import { isObjValue } from "../stateSchemas/valueMetas";
import { ValueName } from "../stateSchemas/ValueName";
import { mathS, NotANumberError } from "../utils/math";
import { GetterVarbBase, NotAVarbNameError } from "./Bases/GetterVarbBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { GetterVarbNumObj } from "./GetterVarbNumObj";
import {
  FeVarbInfo,
  FeVI,
  SectionVarbNames,
  varbIdToInfo,
  varbInfoToId,
} from "./Identifiers/FeInfo";
import { mixedInfoS, VarbInfoMixedFocal } from "./Identifiers/MixedSectionInfo";
import { relVarbInfoS } from "./Identifiers/RelVarbInfo";
import {
  DbVarbInfoMixed,
  FeVarbInfoMixed,
  VarbNames,
} from "./Identifiers/VarbInfoBase";
import { InEntityGetterVarb } from "./InEntityGetterVarb";

class ValueTypeError extends Error {}

export class GetterVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  get numObj(): GetterVarbNumObj<SN> {
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  get inEntity(): InEntityGetterVarb<SN> {
    return new InEntityGetterVarb(this.getterVarbProps);
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
  get sectionVarbNames(): SectionVarbNames<SN> {
    return {
      sectionName: this.sectionName,
      varbName: this.varbName,
    } as SectionVarbNames<SN>;
  }
  get varbInfo(): FeVI<SN> {
    return {
      ...this.feInfo,
      varbName: this.varbName,
    } as FeVI<SN>;
  }
  varbByFocalMixed(varbInfo: VarbInfoMixedFocal): GetterVarb {
    return this.section.varbByFocalMixed(varbInfo);
  }
  get inputLabel() {
    return this.varbLabelToString(this.varbLabels.inputLabel);
  }
  get variableLabel() {
    return this.varbLabelToString(this.varbLabels.variableLabel);
  }
  private varbLabelToString(varbLabel: VarbLabel): string {
    if (typeof varbLabel === "string") {
      if (varbLabel) return varbLabel;
      else throw new Error("varbLabel is blank");
    } else {
      const varb = this.section.varbByFocalMixed(varbLabel);
      const { valueName } = varb;
      if (["stringObj", "string"].includes(valueName)) {
        return varb.stringValue;
      } else {
        throw new Error(`valueName "${valueName}" is not accounted for.`);
      }
    }
  }
  get varbLabels(): VarbInfoTextProps {
    return this.labelSource.rawVarbLabels;
  }
  private get rawVarbLabels() {
    return getVarbLabels(this.sectionName, this.varbName as any);
  }
  private get labelSource(): GetterVarb<any> {
    const { sourceFinder } = this.rawVarbLabels;
    if (sourceFinder === null) {
      return this;
    } else if (relVarbInfoS.isLocal(sourceFinder)) {
      return this.section.varbByFocalMixed(sourceFinder);
    } else {
      return this.switchLabelSource(sourceFinder);
    }
  }
  private switchLabelSource(
    overrideSwitches: LabelOverrideSwitches
  ): GetterVarb {
    for (const { sourceInfo, switchInfo, switchValue } of overrideSwitches) {
      const switchVarb = this.varbByFocalMixed(switchInfo);
      if (switchValue === switchVarb.valueNext()) {
        return this.varbByFocalMixed(sourceInfo);
      }
    }
    throw new Error(`No switchVarb had a matching value`);
  }
  checkObjValue(): { isEmpty: boolean; isValid: boolean } {
    const value = this.multiValue("numObj", "stringObj", "string");
    const text = typeof value === "string" ? value : value.mainText;
    if (!text) {
      return {
        isEmpty: true,
        isValid: false,
      };
    } else {
      return {
        isEmpty: false,
        isValid: true,
      };
    }
  }
  get numberValue(): number {
    const val = this.value("any");
    if (val && typeof val === "object" && "solvableText" in val) {
      const numString = this.numObj.solveTextToNumStringNext();
      return mathS.parseFloatStrict(numString);
    } else {
      return mathS.parseFloatStrict(`${val}`);
    }
  }
  get stringValue(): string {
    const val = this.value("any");
    if (val) {
      if (typeof val === "string") {
        return val;
      } else if (isObjValue(val)) {
        return val.mainText;
      }
    }
    return `${val}`;
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
  get displayNumber(): string {
    const num = this.numObjOutput;
    if (typeof num === "number") {
      return this.meta.roundForDisplay(num);
    } else return num;
  }
  get numObjOutput(): NumObjOutput {
    try {
      let val = this.numberValue;
      if (`${val}` === "NaN") {
        throw new Error("no NaN allowed");
      }
      return val;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        if (
          this.hasValueType("numObj") &&
          this.value("numObj").solvableText === notApplicableString
        ) {
          return "N/A";
        } else {
          return "?";
        }
      } else {
        throw ex;
      }
    }
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
  dbVarbInfoMixed(): DbVarbInfoMixed<SN> {
    return {
      ...this.section.dbInfoMixed(),
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
  value<VT extends ValueNameOrAny = "any">(
    valueName?: VT
  ): StateValueOrAny<VT> {
    const { value } = this.raw;
    if ([this.valueName, "any"].includes(valueName ?? "any")) {
      return clone(value) as StateValueOrAny<VT>;
    } else {
      throw new ValueTypeError(
        `Value "${value}" of ${this.sectionName}.${this.varbName} not of type ${valueName}, and this.valueName is ${this.valueName}`
      );
    }
  }
  multiValue<VT extends ValueName>(...valueNames: VT[]): StateValueOrAny<VT> {
    const { value } = this.raw;
    for (const valueName of valueNames) {
      const meta = this.sectionsMeta.valueByName(valueName);
      if (meta.is(value)) {
        return clone(value) as StateValueOrAny<VT>;
      }
    }
    throw new ValueTypeError(
      `Value of ${this.sectionName}.${
        this.varbName
      } not of type ${valueNames.join(" ")}`
    );
  }
  valueNext() {
    const value = this.value();
    this.meta.validateValue(value);
    return value;
  }
  valueSafe<AV extends any>(acceptedValues: readonly AV[]): AV {
    const value = this.valueNext() as any;
    if (acceptedValues.includes(value)) {
      return value;
    } else {
      throw new Error(
        `value "${value}" is not included in acceptedValues: ${acceptedValues.toString()}`
      );
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
          const switchValue = switchVarb.multiValue(...switchValueNames);
          if (override.switchValue === switchValue) {
            source = this.section.varbByFocalMixed(override.sourceInfo);
            break;
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
  get displayName(): string {
    return this.inputLabel;
  }
  get sectionDotVarbName() {
    return `${this.sectionName}.${this.varbName}`;
  }
  get startAdornment(): string {
    return this.displayMeta.startAdornment;
  }
  get endAdornment(): string {
    return this.displayMeta.endAdornment;
  }
  get displayValue(): string {
    if (this.hasValueType("numObj")) {
      return this.displayNumber;
    } else return `${this.value()}`;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<StrAdornments> = {}) {
    const { displayMeta } = this;
    return `${startAdornment ?? displayMeta.startAdornment}${
      this.displayValue
    }${endAdornment ?? displayMeta.endAdornment}`;
  }
  localVarb(varbName: string) {
    return this.getterSection.varb(varbName);
  }
  localValue<VT extends ValueNameOrAny>(
    varbName: string,
    valueName?: VT
  ): StateValueOrAny<VT> {
    return this.localVarb(varbName).value(valueName ?? ("any" as VT));
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
    try {
      return this.section.varbsByFocalMixed(multiVarbInfo);
    } catch (err) {
      if (err instanceof NotAVarbNameError) {
        throw new NotAVarbNameError(
          `GetterVarb ${this.sectionName}.${this.varbName} got message "${err.message}" when searching for varb of type ${multiVarbInfo.infoType}`
        );
      } else {
        throw err;
      }
    }
  }
  inputProps(valueName?: ValueNameOrAny): {
    id: string;
    name: string;
    value: StateValue;
    label: string;
  } {
    return {
      id: this.varbName,
      name: this.varbName,
      value: this.value(valueName ?? "any"),
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
    return varbInfoToId(info);
  }
  static varbInfosToVarbIds(varbInfos: FeVarbInfo[]): string[] {
    return varbInfos.map((varbInfo) => {
      return GetterVarb.feVarbInfoToVarbId(varbInfo);
    });
  }
  static varbIdToVarbInfo(varbId: string): FeVarbInfo {
    return varbIdToInfo(varbId);
  }
}
