import { ContentState } from "draft-js";
import { AddToStoreProps } from "../../../modules/FeStore/SolverFeStore";
import { UserData } from "../../apiQueriesShared/validateUserData";
import { defaultMaker } from "../../defaultMaker/defaultMaker";
import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import {
  FeSectionInfo,
  FeVarbInfo,
  FeVarbValueInfo,
} from "../../SectionsMeta/SectionInfo/FeInfo";
import { DbIdProp, FeIdProp } from "../../SectionsMeta/SectionInfo/NanoIdInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import {
  FeStoreInfo,
  StoreNameProp,
  StoreSectionName,
} from "../../SectionsMeta/sectionStores";
import { DealMode } from "../../SectionsMeta/values/StateValue/dealMode";
import { StateSections } from "../../StateSections/StateSections";
import { EditorUpdaterVarb } from "../../StateSetters/EditorUpdaterVarb";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { AddChildOptions } from "../../StateUpdaters/UpdaterSection";
import { Arr } from "../../utils/Arr";
import { Merge } from "../../utils/Obj/merge";

const sectionActionNames = [
  "addChild",
  "addToStore",
  "saveAndOverwriteToStore",
  "archiveDeal",
  "activateDeal",
  "addActiveDeal",
  "copyInStore",
  "loadSelfCopyFromStore",
  "removeSelf",
  "removeFromStore",
  "removeFromStoreByDbId",
  "resetSelfToDefault",
  "updateValue",
  "updateValueFromContent",
  "onChangeIdle",
  "setState",
  "finishSave",
  "removeStoredDeal",
  "loadUserData",
  "incrementGetUserDataTry",
  "makeDefaultMain",
  "addDealToCompare",
  "removeDealFromCompare",
] as const;
export type SectionActionName = (typeof sectionActionNames)[number];

type _CheckSectionActionProps<
  T extends Partial<Record<SectionActionName, any>>
> = T;
type DefaultActionProps = _CheckSectionActionProps<
  Record<SectionActionName, {}>
>;
type ExtraActionProps = _CheckSectionActionProps<{
  setState: { sections: StateSections };

  loadUserData: { userData: UserData };
  finishSave: { success: boolean };

  addActiveDeal: { dealMode: DealMode };
  archiveDeal: FeIdProp;
  activateDeal: FeIdProp;
  removeStoredDeal: FeIdProp;

  addChild: AddChildActionProps;
  updateValue: UpdateValueProps;
  updateValueFromContent: UpdateContentValueProps;
  removeSelf: RemoveSelfProps;
  resetSelfToDefault: FeSectionInfo<StoreSectionName>;
  loadSelfCopyFromStore: FeSectionInfo<StoreSectionName> & DbIdProp;

  addToStore: AddToStoreProps;
  saveAndOverwriteToStore: { feInfo: FeSectionInfo<StoreSectionName> };
  copyInStore: FeStoreInfo;
  removeFromStore: RemoveFromStoreProps;
  removeFromStoreByDbId: RemoveFromStoreDbIdProps;

  addDealToCompare: FeIdProp;
  removeDealFromCompare: FeIdProp;
}>;

export type ActionPropsMap = _CheckSectionActionProps<
  Merge<DefaultActionProps, ExtraActionProps>
>;

export type SectionActionsMap = {
  [AN in SectionActionName]: ActionPropsMap[AN] & { type: AN };
};

export type SectionsAction = SectionActionsMap[SectionActionName];

interface UpdateValueProps extends FeVarbValueInfo, IdOfSectionToSaveProp {}
interface UpdateContentValueProps
  extends VarbContentInfo,
    IdOfSectionToSaveProp {}
interface RemoveFromStoreProps extends StoreNameProp, FeIdProp {}
interface RemoveFromStoreDbIdProps extends StoreNameProp, DbIdProp {}
interface AddChildActionProps<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends IdOfSectionToSaveProp {
  feInfo: FeSectionInfo<SN>;
  childName: CN;
  options?: AddChildOptions<SN, CN>;
}
interface RemoveSelfProps extends IdOfSectionToSaveProp, FeSectionInfo {}

interface IdOfSectionToSaveProp {
  idOfSectionToSave?: string;
}
export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

export function isSectionActionName(value: any): value is SectionActionName {
  return sectionActionNames.includes(value);
}

type SavableActionName = SavableActions["type"];
type SavableActions = Extract<SectionsAction, { idOfSectionToSave?: string }>;

const savableActionNames = Arr.extractStrict(sectionActionNames, [
  "addChild",
  "removeSelf",
  "resetSelfToDefault",
  "updateValue",
  "updateValueFromContent",
] as const);
export function isSavableActionName(value: any): value is SavableActionName {
  return savableActionNames.includes(value);
}

export type SectionActionProps<T extends SectionActionName> = ActionPropsMap[T];

type ReducerActions = {
  [AN in SectionActionName]: (prop: ActionPropsMap[AN]) => void;
};

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

  const reducerActions: ReducerActions = {
    setState: () => {
      throw new Error("State should already be returned.");
    },
    makeDefaultMain: () => {
      const main = solverSections.oneAndOnly("main");
      main.loadSelfAndSolve(defaultMaker.makeSectionPack("main"));
    },
    loadUserData: ({ userData }) =>
      solverSections.feStore.loadUserData(userData),
    incrementGetUserDataTry: () =>
      solverSections.feStore.incrementGetUserDataTry(),

    onChangeIdle: () => solverSections.feStore.onChangeIdle(),
    finishSave: (props) => solverSections.feStore.finishSave(props),

    addChild: ({ feInfo, childName, options }) => {
      const section = solverSections.solverSection(feInfo);
      section.addChildAndSolve(childName, options);
    },
    removeSelf: (props) => {
      const section = solverSections.solverSection(props);
      section.removeSelfAndSolve();
    },
    resetSelfToDefault: (props) => {
      const section = solverSections.solverSection(props);
      section.resetToDefaultAndSolve();
    },
    loadSelfCopyFromStore: ({ dbId, sectionName, feId }) => {
      const section = solverSections.solverSection({ sectionName, feId });
      const { mainStoreName } = section.get;
      const stored = solverSections.feStore.get.childByDbId({
        childName: mainStoreName,
        dbId,
      });
      section.loadSelfAndSolve(stored.makeSectionPack());
      section.updater.newDbId();

      if (section.isOfSectionName("property")) {
        const { parent } = section.get;
        if (parent.isOfSectionName("deal")) {
          const dealMode = parent.valueNext("dealMode");
          section.updateValues({ propertyMode: dealMode });
        }
      }
    },
    updateValue: (props) => {
      const varb = solverSections.solverVarb(props);
      varb.directUpdateAndSolve(props.value);
    },
    updateValueFromContent: (props) => {
      // Needed because previous value is required for new value
      const varb = solverSections.solverVarb(props);
      const { contentState } = props;
      const editorVarb = new EditorUpdaterVarb(
        varb.getterVarbBase.getterVarbProps
      );
      const value = editorVarb.valueFromContentState(contentState);
      varb.editorUpdateAndSolve(value);
    },

    addToStore: (props) => solverSections.feStore.addToStore(props),
    removeFromStore: (props) => solverSections.feStore.removeFromStore(props),
    removeFromStoreByDbId: (props) =>
      solverSections.feStore.removeFromStoreByDbId(props),
    saveAndOverwriteToStore: ({ feInfo }) =>
      solverSections.saveAndOverwriteToStore(feInfo),
    copyInStore: (props) => solverSections.feStore.copyInStore(props),
    archiveDeal: ({ feId }) => solverSections.archiveDeal(feId),
    removeStoredDeal: ({ feId }) => solverSections.removeStoredDeal(feId),
    activateDeal: ({ feId }) => solverSections.activateDealAndSolve(feId),
    addActiveDeal: ({ dealMode }) => solverSections.addActiveDeal(dealMode),
    addDealToCompare: ({ feId }) => solverSections.addDealToCompare(feId),
    removeDealFromCompare: ({ feId }) => {
      solverSections.removeDealFromDealCompare(feId);
    },
  };

  switch (action.type) {
    case "addChild":
    case "removeSelf":
    case "updateValue":
    case "updateValueFromContent": {
      if (action.idOfSectionToSave) {
        solverSections.feStore.addChangeToSave(action.idOfSectionToSave, {
          changeName: "update",
        });
      }
    }
  }

  reducerActions[action.type](action as any);
  return solverSections.stateSections;
};
