import { ContentState, EditorState } from "draft-js";
import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { EditorValue } from "../SectionsMeta/values/EditorValue";
import {
  StateValue,
  StateValueOrAny,
  ValueNameOrAny,
} from "../SectionsMeta/values/StateValue";
import { ValueInEntityInfo } from "../SectionsMeta/values/StateValue/valuesShared/entities";
import { ValueName } from "../SectionsMeta/values/ValueName";
import { VarbMeta } from "../SectionsMeta/VarbMeta";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../StateGetters/InEntityGetterVarb";
import { SolverVarb } from "../StateSolvers/SolverVarb";
import { CreateEditorProps, EditorUpdaterVarb } from "./EditorUpdaterVarb";
import { SetterVarbBase } from "./SetterBases/SetterVarbBase";
import { SetterSections } from "./SetterSections";

export class SetterVarb<
  SN extends SectionName = SectionName
> extends SetterVarbBase<SN> {
  private get solverVarb() {
    return SolverVarb.init(this.getterVarbBase.getterVarbProps);
  }
  get varbName(): string {
    return this.meta.varbName;
  }
  get feVarbInfo(): FeVarbInfo<SN> {
    return this.get.feVarbInfo;
  }
  get setterSections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  private get editorUpdater() {
    return new EditorUpdaterVarb(this.getterVarbBase.getterVarbProps);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get meta(): VarbMeta<SN> {
    return this.get.meta;
  }
  get sections() {
    return new GetterSections(this.getterVarbBase.getterSectionsProps);
  }
  inputProps(valueName?: ValueName) {
    return {
      ...this.get.inputProps(valueName),
      onChange: this.makeChangeHandler(),
    };
  }
  makeChangeHandler(): (e: any) => void {
    return (e) => this.onChange(e);
  }
  private onChange({ currentTarget }: { currentTarget: any }): void {
    const { value } = currentTarget;
    if (this.meta.validateValue(value)) {
      this.updateValue(value);
    }
  }
  updateValue(value: StateValue): void {
    this.solverVarb.directUpdateAndSolve(value);
    this.setSections();
  }
  toggleValue() {
    this.updateValue(!this.value("boolean"));
  }
  loadValueFromVarb(varbInfo: ValueInEntityInfo) {
    this.solverVarb.loadValueFromVarb(varbInfo);
    this.setSections();
  }
  updateValueFromEditor(contentState: ContentState): void {
    const value = this.editorUpdater.valueFromContentState(contentState);
    this.solverVarb.editorUpdateAndSolve(value);
    this.setSections();
  }
  valueFromContentState(contentState: ContentState): EditorValue {
    return this.editorUpdater.valueFromContentState(contentState);
  }
  createEditor(props: CreateEditorProps): EditorState {
    return this.editorUpdater.createEditor(props);
  }
  value<VT extends ValueNameOrAny>(valueName: VT): StateValueOrAny<VT> {
    return this.get.value(valueName);
  }
  get hasInVarbs(): boolean {
    return this.solverVarb.hasInVarbs;
  }
}
