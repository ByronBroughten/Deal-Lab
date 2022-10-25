import { ContentState } from "draft-js";
import { StateValue } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import {
  FeSectionInfo,
  FeVarbInfo,
  VarbValueInfo,
} from "../../SectionsMeta/Info";
import { StateSections } from "../../StateSections/StateSections";
import { EditorUpdaterVarb } from "../../StateSetters/EditorUpdaterVarb";
import { SolverSection } from "../../StateSolvers/SolverSection";
import { SolverVarb } from "../../StateSolvers/SolverVarb";

interface RemoveSelfAction extends FeSectionInfo {
  type: "removeSelf";
}
interface UpdateValueAction extends VarbValueInfo {
  type: "updateValue";
  value: StateValue;
}
interface UpdateValueFromEditorAction extends FeVarbInfo {
  type: "updateValueFromContent";
  contentState: ContentState;
}

export type SectionsAction =
  | { type: "setState"; sections: StateSections }
  | RemoveSelfAction
  | UpdateValueAction
  | UpdateValueFromEditorAction;

export const sectionsReducer: React.Reducer<StateSections, SectionsAction> = (
  previousSections,
  action
) => {
  const sectionsShare = { sections: previousSections };
  switch (action.type) {
    case "setState":
      return action.sections;
    case "removeSelf": {
      const section = SolverSection.init({
        ...action,
        sectionsShare,
      });
      section.removeSelfAndSolve();
      return section.sectionsShare.sections;
    }
    case "updateValue": {
      const varb = SolverVarb.init({
        ...action,
        sectionsShare,
      });
      varb.directUpdateAndSolve(action.value);
      return varb.sectionsShare.sections;
    }
    case "updateValueFromContent": {
      const { contentState } = action;
      const solverVarb = SolverVarb.init({
        ...action,
        sectionsShare,
      });

      const editorVarb = new EditorUpdaterVarb(
        solverVarb.getterVarbBase.getterVarbProps
      );
      const value = editorVarb.valueFromContentState(contentState);
      solverVarb.editorUpdateAndSolve(value);
      return solverVarb.sectionsShare.sections;
    }
  }
};
