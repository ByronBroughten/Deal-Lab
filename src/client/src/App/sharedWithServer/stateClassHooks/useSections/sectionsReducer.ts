import { ContentState } from "draft-js";
import {
  FeSectionInfo,
  FeVarbInfo,
  FeVarbValueInfo,
} from "../../SectionsMeta/SectionInfo/FeInfo";
import { SectionPathContextName } from "../../SectionsMeta/sectionPathContexts";
import { StateSections } from "../../StateSections/StateSections";
import { EditorUpdaterVarb } from "../../StateSetters/EditorUpdaterVarb";
import { SolverSection } from "../../StateSolvers/SolverSection";
import { SolverVarb } from "../../StateSolvers/SolverVarb";
import { GetterSections } from "./../../StateGetters/GetterSections";

export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

interface RemoveSelfAction extends FeSectionInfo {
  type: "removeSelf";
  sectionContextName: SectionPathContextName;
}
interface UpdateValueAction extends FeVarbValueInfo {
  type: "updateValue";
  sectionContextName: SectionPathContextName;
}
interface UpdateValueFromEditorAction extends VarbContentInfo {
  type: "updateValueFromContent";
  sectionContextName: SectionPathContextName;
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
  if (action.type === "setState") {
    return action.sections;
  } else {
    const props = GetterSections.initProps({
      sections: previousSections,
      ...action,
    });
    switch (action.type) {
      case "removeSelf": {
        const section = SolverSection.init({
          ...action,
          ...GetterSections.initProps({
            sections: previousSections,
            ...action,
          }),
        });
        section.removeSelfAndSolve();
        return section.sectionsShare.sections;
      }
      case "updateValue": {
        // here's the thing. the sectionsContext
        // is important for updateValue
        const varb = SolverVarb.init({
          ...action,
          ...props,
        });
        varb.directUpdateAndSolve(action.value);
        return varb.sectionsShare.sections;
      }
      case "updateValueFromContent": {
        const { contentState } = action;
        const solverVarb = SolverVarb.init({
          ...action,
          ...props,
        });

        const editorVarb = new EditorUpdaterVarb(
          solverVarb.getterVarbBase.getterVarbProps
        );
        const value = editorVarb.valueFromContentState(contentState);
        solverVarb.editorUpdateAndSolve(value);
        return solverVarb.sectionsShare.sections;
      }
    }
  }
};
