import { ContentState } from "draft-js";
import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import {
  FeSectionInfo,
  FeVarbInfo,
  FeVarbValueInfo,
} from "../../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import { StateSections } from "../../StateSections/StateSections";
import { EditorUpdaterVarb } from "../../StateSetters/EditorUpdaterVarb";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { AddChildOptions } from "../../StateUpdaters/UpdaterSection";
import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";

export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

interface SaveSectionIdProp {
  idOfSectionToSave?: string;
}

interface LoginUser {
  type: "loginUser";
}
interface RemoveSelfAction extends SaveSectionIdProp, FeSectionInfo {
  type: "removeSelf";
}
interface AddChildAction<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends SaveSectionIdProp {
  feInfo: FeSectionInfo<SN>;
  childName: CN;
  options: AddChildOptions<SN, CN>;
  type: "addChild";
}
interface UpdateValueAction extends SaveSectionIdProp, FeVarbValueInfo {
  type: "updateValue";
}
interface UpdateValueFromEditorAction
  extends SaveSectionIdProp,
    VarbContentInfo {
  type: "updateValueFromContent";
}

interface InitializeSaveAttempts {
  type: "initializeSaveAttempt";
}

interface PreSaveAttempt {
  type: "preSave";
  saveAttemptFeId: string;
}

interface FinishSaveAttempt {
  type: "finishSave";
  feId: string;
  success: boolean;
}

export type SectionsAction =
  | { type: "setState"; sections: StateSections }
  | AddChildAction
  | RemoveSelfAction
  | UpdateValueAction
  | UpdateValueFromEditorAction
  | InitializeSaveAttempts
  | PreSaveAttempt
  | FinishSaveAttempt;

type SectionActionName = SectionsAction["type"];
const reducerActionNameMap: Record<SectionActionName, 0> = {
  addChild: 0,
  removeSelf: 0,
  updateValue: 0,
  updateValueFromContent: 0,
  initializeSaveAttempt: 0,
  setState: 0,
  preSave: 0,
  finishSave: 0,
};
export const sectionActionNames = Obj.keys(reducerActionNameMap);
export function isSectionActionName(value: any): value is SectionActionName {
  return sectionActionNames.includes(value);
}

type SavableActionName = SavableActions["type"];
type SavableActions = Extract<SectionsAction, { idOfSectionToSave?: string }>;

const savableActionNames = Arr.extractStrict(sectionActionNames, [
  "addChild",
  "removeSelf",
  "updateValue",
  "updateValueFromContent",
] as const);
export function isSavableActionName(value: any): value is SavableActionName {
  return savableActionNames.includes(value);
}

export type ReducerActionName = SectionsAction["type"];

export type SectionActionsTypeMap = {
  [ST in ReducerActionName]: Extract<SectionsAction, { type: ST }>;
};
type SectionActionsPropsMap = {
  [ST in ReducerActionName]: Omit<SectionActionsTypeMap[ST], "type">;
};
export type SectionActionProps<T extends ReducerActionName> =
  SectionActionsPropsMap[T];

export const sectionsReducer: React.Reducer<StateSections, SectionsAction> = (
  currentSections,
  action
) => {
  if (action.type === "setState") {
    return action.sections;
  }

  const solverSections = SolverSections.init({
    sectionsShare: { sections: currentSections },
  });

  switch (action.type) {
    case "initializeSaveAttempt": {
      solverSections.feStore.initializeSaveAttemptAndSolve();
      return solverSections.stateSections;
    }
    case "preSave": {
      solverSections.feStore.preSaveAndSolve(action.saveAttemptFeId);
      return solverSections.stateSections;
    }
    case "finishSave": {
      solverSections.feStore.finishSaveAttempt(action);
      return solverSections.stateSections;
    }
  }

  if (action.idOfSectionToSave) {
    solverSections.feStore.addIdOfSectionToSave(action.idOfSectionToSave);
  }
  switch (action.type) {
    case "addChild": {
      const section = solverSections.solverSection(action.feInfo);
      section.addChildAndSolve(action.childName, action.options);
      return section.stateSections;
    }
    case "removeSelf": {
      const section = solverSections.solverSection(action);
      section.removeSelfAndSolve();
      return section.stateSections;
    }
    case "updateValue": {
      const varb = solverSections.solverVarb(action);
      varb.directUpdateAndSolve(action.value);
      return varb.stateSections;
    }
    case "updateValueFromContent": {
      // This case is needed because the previous value is required to
      // make the new value
      const { contentState } = action;
      const solverVarb = solverSections.solverVarb(action);

      const editorVarb = new EditorUpdaterVarb(
        solverVarb.getterVarbBase.getterVarbProps
      );
      const value = editorVarb.valueFromContentState(contentState);
      solverVarb.editorUpdateAndSolve(value);
      return solverVarb.stateSections;
    }
  }
};
