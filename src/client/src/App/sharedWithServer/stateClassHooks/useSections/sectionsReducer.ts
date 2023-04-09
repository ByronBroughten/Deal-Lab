import { ContentState } from "draft-js";
import { AddToStoreProps } from "../../../modules/FeStore/SolverFeStore";
import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import {
  FeSectionInfo,
  FeVarbInfo,
  FeVarbValueInfo,
} from "../../SectionsMeta/SectionInfo/FeInfo";
import { FeIdProp } from "../../SectionsMeta/SectionInfo/NanoIdInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import { FeStoreInfo, StoreName } from "../../SectionsMeta/sectionStores";
import { StateSections } from "../../StateSections/StateSections";
import { EditorUpdaterVarb } from "../../StateSetters/EditorUpdaterVarb";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { AddChildOptions } from "../../StateUpdaters/UpdaterSection";
import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";

interface IdOfSectionToSaveProp {
  idOfSectionToSave?: string;
}

export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

interface LoginUser {
  type: "loginUser";
}

interface ActivateDeal extends FeIdProp {
  type: "activateDeal";
}
interface AddToStore<CN extends StoreName = StoreName>
  extends AddToStoreProps<CN> {
  type: "addToStore";
}
interface CopyInStore extends FeStoreInfo {
  type: "copyInStore";
}
interface RemoveFromStore<CN extends StoreName = StoreName> {
  storeName: CN;
  feId: string;
  type: "removeFromStore";
}

interface AddChildAction<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends IdOfSectionToSaveProp {
  feInfo: FeSectionInfo<SN>;
  childName: CN;
  options?: AddChildOptions<SN, CN>;
  type: "addChild";
}
interface RemoveSelfAction extends IdOfSectionToSaveProp, FeSectionInfo {
  type: "removeSelf";
}

interface UpdateValueAction extends FeVarbValueInfo {
  idOfSectionToSave?: string;
  type: "updateValue";
}
interface UpdateValueFromEditorAction extends VarbContentInfo {
  idOfSectionToSave?: string;
  type: "updateValueFromContent";
}

interface InitializeSaveAttempts {
  type: "onChangeIdle";
}

interface FinishSaveAttempt {
  type: "finishSave";
  success: boolean;
}

interface AddActiveDeal {
  type: "addActiveDeal";
}

interface RemoveStoredDeal {
  feId: string;
  type: "removeStoredDeal";
}

export type SectionsAction =
  | { type: "setState"; sections: StateSections }
  | AddChildAction
  | RemoveSelfAction
  | AddToStore
  | CopyInStore
  | RemoveFromStore
  | UpdateValueAction
  | UpdateValueFromEditorAction
  | InitializeSaveAttempts
  | FinishSaveAttempt
  | AddActiveDeal
  | RemoveStoredDeal
  | ActivateDeal;

type SectionActionName = SectionsAction["type"];
const reducerActionNameMap: Record<SectionActionName, 0> = {
  addChild: 0,
  addToStore: 0,
  copyInStore: 0,
  removeSelf: 0,
  removeFromStore: 0,
  updateValue: 0,
  updateValueFromContent: 0,
  onChangeIdle: 0,
  setState: 0,
  finishSave: 0,
  addActiveDeal: 0,
  activateDeal: 0,
  removeStoredDeal: 0,
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
      break;
    }
    case "finishSave": {
      solverSections.feStore.finishSave(action);
      break;
    }
    case "activateDeal": {
      solverSections.activateDealAndSolve(action.feId);
      break;
    }
    case "addActiveDeal": {
      solverSections.addActiveDeal();
      break;
    }

    case "removeStoredDeal": {
      solverSections.removeStoredDeal(action.feId);
      break;
    }

    case "addToStore": {
      solverSections.feStore.addToStore(action);
      break;
    }
    case "copyInStore": {
      solverSections.feStore.copyInStore(action);
      break;
    }
    case "removeFromStore": {
      solverSections.feStore.removeFromStore(action);
      break;
    }
    case "addChild":
    case "removeSelf":
    case "updateValue":
    case "updateValueFromContent": {
      if (action.idOfSectionToSave) {
        solverSections.feStore.addChangeToSave(action.idOfSectionToSave, {
          changeName: "update",
        });
      }
      switch (action.type) {
        case "addChild": {
          const section = solverSections.solverSection(action.feInfo);
          section.addChildAndSolve(action.childName, action.options);
          break;
        }
        case "removeSelf": {
          const section = solverSections.solverSection(action);
          section.removeSelfAndSolve();
          break;
        }
        case "updateValue":
        case "updateValueFromContent": {
          const varb = solverSections.solverVarb(action);
          if (action.type === "updateValue") {
            varb.directUpdateAndSolve(action.value);
          } else {
            // This case is needed because the previous value is required to
            // make the new value
            const { contentState } = action;
            const editorVarb = new EditorUpdaterVarb(
              varb.getterVarbBase.getterVarbProps
            );
            const value = editorVarb.valueFromContentState(contentState);
            varb.editorUpdateAndSolve(value);
          }
          break;
        }
      }
      break;
    }
  }
  return solverSections.stateSections;
};
