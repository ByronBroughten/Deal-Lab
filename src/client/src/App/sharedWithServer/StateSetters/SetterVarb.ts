import { ContentState, EditorState } from "draft-js";
import { ValueInEntityInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { ValueName } from "../SectionsMeta/baseSectionsVarbs/baseVarb";
import { ValueTypesPlusAny } from "../SectionsMeta/baseSectionsVarbs/StateVarbTypes";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { VarbMeta } from "../SectionsMeta/VarbMeta";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../StateGetters/InEntityGetterVarb";
import { SolverVarb } from "../StateSolvers/SolverVarb";
import {
  CreateEditorProps,
  EditorUpdaterVarb,
  EditorValue,
} from "./EditorUpdaterVarb";
import { SetterVarbBase } from "./SetterBases/SetterVarbBase";
import { SetterSections } from "./SetterSections";

export class SetterVarb<
  SN extends SectionNameByType = SectionNameByType
> extends SetterVarbBase<SN> {
  private solverVarb = SolverVarb.init(this.getterVarbBase.getterVarbProps);
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
    if (this.meta.validateVarbValue(value)) {
      this.updateValue(value);
    }
  }
  updateValue(value: StateValue): void {
    this.solverVarb.directUpdateAndSolve(value);
    this.setSections();
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
  value<VT extends ValueName | "any">(valueName: VT): ValueTypesPlusAny[VT] {
    return this.get.value(valueName);
  }
  get hasInVarbs(): boolean {
    return this.solverVarb.hasInVarbs;
  }
}
