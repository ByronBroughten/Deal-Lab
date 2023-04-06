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
  saveOperation?: boolean;
}
interface AddChildAction<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends SaveSectionIdProp {
  saveOperation?: boolean;
  feInfo: FeSectionInfo<SN>;
  childName: CN;
  options?: AddChildOptions<SN, CN>;
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
  type: "onChangeIdle";
}

interface FinishSaveAttempt {
  type: "finishSave";
  success: boolean;
}

export type SectionsAction =
  | { type: "setState"; sections: StateSections }
  | AddChildAction
  | RemoveSelfAction
  | UpdateValueAction
  | UpdateValueFromEditorAction
  | InitializeSaveAttempts
  | FinishSaveAttempt;

type SectionActionName = SectionsAction["type"];
const reducerActionNameMap: Record<SectionActionName, 0> = {
  addChild: 0,
  removeSelf: 0,
  updateValue: 0,
  updateValueFromContent: 0,
  onChangeIdle: 0,
  setState: 0,
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
    case "onChangeIdle": {
      solverSections.feStore.onChangeIdle();
      return solverSections.stateSections;
    }
    case "finishSave": {
      solverSections.feStore.finishSave(action);
      return solverSections.stateSections;
    }
  }

  if (action.idOfSectionToSave) {
    solverSections.feStore.addChangeToSave(action.idOfSectionToSave, {
      changeName: "update",
    });
  }
  switch (action.type) {
    case "addChild": {
      const section = solverSections.solverSection(action.feInfo);
      const child = section.prepper.addAndGetChild(
        action.childName,
        action.options
      );
      if (action.saveOperation) {
        solverSections.feStore.addChangeToSave(child.get.sectionId, {
          changeName: "add",
        });
      }
      section.solve();
      return section.stateSections;
    }
    case "removeSelf": {
      const section = solverSections.solverSection(action);
      const { sectionId, dbId } = section.get;
      section.removeSelfAndSolve();
      if (action.saveOperation) {
        solverSections.feStore.addChangeToSave(sectionId, {
          changeName: "remove",
          dbId,
        });
      }
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
