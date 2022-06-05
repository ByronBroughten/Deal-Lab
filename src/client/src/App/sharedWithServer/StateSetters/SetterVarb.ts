import { EditorState } from "draft-js";
import { StateValue } from "../Analyzer/StateSection/StateVarb/stateValue";
import { InVarbInfo, ValueTypesPlusAny } from "../FeSections/FeSection/FeVarb";
import { InEntityVarbInfo } from "../SectionsMeta/baseSections/baseValues/entities";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
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
  private updaterVarb = new UpdaterVarb(this.getterVarbBase.getterVarbProps);
  private getterVarb = new GetterVarb(this.getterVarbBase.getterVarbProps);
  private editorUpdater = new EditorUpdaterVarb(
    this.getterVarbBase.getterVarbProps
  );
  get get() {
    return this.getterVarb;
  }
  get sections() {
    return new GetterSections(this.getterVarbBase.getterSectionsProps);
  }
  updateValueDirectly(value: StateValue): void {
    this.solverVarb.directUpdateAndSolve(value);
    this.setSections();
  }
  loadValueFromVarb(varbInfo: InEntityVarbInfo) {
    this.solverVarb.loadValueFromVarb(varbInfo);
    this.setSections();
  }
  updateValueFromEditor(editorState: EditorState): void {
    this.editorUpdater.update(editorState);
    // solving the varb that was updated messes with the editor cursor
    // due to manualUpdateEditorToggle, so best to only solve connected varbs
    this.solverVarb.updateConnectedVarbs();
    this.setSections();
  }
  createEditor(props: CreateEditorProps): EditorState {
    return this.editorUpdater.createEditor(props);
  }
  get manualUpdateEditorToggle(): boolean | undefined {
    return this.updaterVarb.manualUpdateEditorToggle;
  }
  value<VT extends ValueTypeName | "any">(
    valueType: VT
  ): ValueTypesPlusAny[VT] {
    return this.getterVarb.value(valueType);
  }
  get hasInVarbs(): boolean {
    return this.solverVarb.hasInVarbs;
  }
  get inVarbInfos(): InVarbInfo[] {
    return this.solverVarb.inVarbInfos;
  }
}
