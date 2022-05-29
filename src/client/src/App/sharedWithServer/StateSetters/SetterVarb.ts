import { EditorState } from "draft-js";
import { useSectionsContext } from "../../modules/useSections";
import { StateValue } from "../Analyzer/StateSection/StateVarb/stateValue";
import { ValueTypesPlusAny } from "../FeSections/FeSection/FeVarb";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { SolverVarb } from "../StateSolvers/SolverVarb";
import { StrictOmit } from "../utils/types";
import { UpdaterVarb } from "./../StateUpdaters/UpdaterVarb";
import { CreateEditorProps, EditorUpdaterVarb } from "./EditorUpdaterVarb";
import { SetterVarbBase } from "./SetterBases/SetterVarbBase";

export class SetterVarb<
  SN extends SectionName = SectionName
> extends SetterVarbBase<SN> {
  solverVarb = SolverVarb.init(this.getterVarbBase.getterVarbProps);
  updaterVarb = new UpdaterVarb(this.getterVarbBase.getterVarbProps);
  getterVarb = new GetterVarb(this.getterVarbBase.getterVarbProps);
  private editorUpdater = new EditorUpdaterVarb(
    this.getterVarbBase.getterVarbProps
  );
  updateValueDirectly(value: StateValue): void {
    this.solverVarb.directUpdateAndSolve(value);
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
}

interface UseSetterVarbProps<SN extends SectionName>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useSetterVarb<SN extends SectionName>(
  props: UseSetterVarbProps<SN>
): SetterVarb<SN> {
  const { sections, setSections } = useSectionsContext();
  return new SetterVarb({
    ...props,
    setSections,
    sectionsShare: { sections },
  });
}
