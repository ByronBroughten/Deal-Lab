import { ContentState, EditorState } from "draft-js";
import {
  InEntityVarbInfo,
  InVarbInfo,
} from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../SectionsMeta/baseSectionsUtils/baseVarb";
import { ValueTypesPlusAny } from "../SectionsMeta/baseSectionsUtils/StateVarbTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { VarbMeta } from "../SectionsMeta/VarbMeta";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { SolverVarb } from "../StateSolvers/SolverVarb";
import { UpdaterVarb } from "./../StateUpdaters/UpdaterVarb";
import { CreateEditorProps, EditorUpdaterVarb } from "./EditorUpdaterVarb";
import { SetterVarbBase } from "./SetterBases/SetterVarbBase";

export class SetterVarb<
  SN extends SectionName = SectionName
> extends SetterVarbBase<SN> {
  private solverVarb = SolverVarb.init(this.getterVarbBase.getterVarbProps);
  private get updaterVarb() {
    return new UpdaterVarb(this.getterVarbBase.getterVarbProps);
  }
  private get getterVarb() {
    return new GetterVarb(this.getterVarbBase.getterVarbProps);
  }
  private get editorUpdater() {
    return new EditorUpdaterVarb(this.getterVarbBase.getterVarbProps);
  }
  get get(): GetterVarb<SN> {
    return this.getterVarb;
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
      this.updateValueDirectly(value);
    }
  }
  updateValueDirectly(value: StateValue): void {
    this.solverVarb.directUpdateAndSolve(value);
    this.setSections();
  }
  loadValueFromVarb(varbInfo: InEntityVarbInfo) {
    this.solverVarb.loadValueFromVarb(varbInfo);
    this.setSections();
  }
  updateValueFromEditor(contentState: ContentState): void {
    const value = this.editorUpdater.valueFromContentState(contentState);
    this.solverVarb.editorUpdateAndSolve(value);
    this.setSections();
  }
  createEditor(props: CreateEditorProps): EditorState {
    return this.editorUpdater.createEditor(props);
  }
  get manualUpdateEditorToggle(): boolean | undefined {
    return this.updaterVarb.manualUpdateEditorToggle;
  }
  value<VT extends ValueName | "any">(valueName: VT): ValueTypesPlusAny[VT] {
    return this.getterVarb.value(valueName);
  }
  get hasInVarbs(): boolean {
    return this.solverVarb.hasInVarbs;
  }
  get inVarbInfos(): InVarbInfo[] {
    return this.solverVarb.inVarbInfos;
  }
}
