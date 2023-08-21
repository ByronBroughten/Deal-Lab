import { ContentState } from "draft-js";
import { EditorUpdaterVarb } from "../../../modules/EditorUpdaterVarb";
import { AddToStoreProps } from "../../../modules/FeStore/SolverFeStore";
import { UserData } from "../../apiQueriesShared/validateUserData";
import { defaultMaker } from "../../defaultMaker/defaultMaker";
import { makeEmptyMain } from "../../defaultMaker/makeEmptyMain";
import { MainState } from "../../MainState";
import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
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
import { SectionValues } from "../../SectionsMeta/values/StateValue";
import { DealMode } from "../../SectionsMeta/values/StateValue/dealMode";
import { SolverSections } from "../../StateSolvers/SolverSections";
import { AddChildOptions } from "../../StateUpdaters/UpdaterSection";
import { Arr } from "../../utils/Arr";
import { Merge } from "../../utils/Obj/merge";

const sectionActionNames = [
  "addChild",
  "addToStore",
  "saveAndOverwriteToStore",
  "archiveDeal",
  "loadAndShowArchivedDeals",
  "activateDeal",
  "addActiveDeal",
  "copyInStore",
  "loadSelfCopyFromStore",
  "removeSelf",
  "removeFromStore",
  "removeFromStoreByDbId",
  "resetSelfToDefault",
  "updateValues",
  "updateValue",
  "updateValueFromContent",
  "onChangeIdle",
  "finishSave",
  "removeStoredDeal",
  "doLogin",
  "loadUserData",
  "incrementGetUserDataTry",
  "makeEmptyMain",
  "doDealCompare",
] as const;
export type SectionActionName = (typeof sectionActionNames)[number];

type _CheckSectionActionProps<
  T extends Partial<Record<SectionActionName, any>>
> = T;
type DefaultActionProps = _CheckSectionActionProps<
  Record<SectionActionName, {}>
>;
type ExtraActionProps = _CheckSectionActionProps<{
  loadUserData: { userData: UserData };
  finishSave: { success: boolean };

  addActiveDeal: { dealMode: DealMode };
  archiveDeal: FeIdProp;
  loadAndShowArchivedDeals: { archivedDeals: SectionPack<"deal">[] };
  activateDeal: FeIdProp & { finishEditLoading?: boolean };
  removeStoredDeal: DbIdProp;

  addChild: AddChildActionProps;
  updateValues: UpdateValuesProps;
  updateValue: UpdateValueProps;
  updateValueFromContent: UpdateContentValueProps;
  removeSelf: RemoveSelfProps;
  resetSelfToDefault: FeSectionInfo;
  loadSelfCopyFromStore: FeSectionInfo<StoreSectionName> & DbIdProp;

  addToStore: AddToStoreProps;
  saveAndOverwriteToStore: { feInfo: FeSectionInfo<StoreSectionName> };
  copyInStore: FeStoreInfo;
  removeFromStore: RemoveFromStoreProps;
  removeFromStoreByDbId: RemoveFromStoreDbIdProps;
}>;

export type ActionPropsMap = _CheckSectionActionProps<
  Merge<DefaultActionProps, ExtraActionProps>
>;

export type StateActionsMap = {
  [AN in SectionActionName]: ActionPropsMap[AN] & { type: AN };
};

export type StateAction = StateActionsMap[SectionActionName];

interface IdOfSectionToSaveProp {
  idOfSectionToSave?: string;
}

type UpdateValuesProps = {
  [SN in SectionName]: {
    values: Partial<SectionValues<SN>>;
  } & FeSectionInfo<SN> &
    IdOfSectionToSaveProp;
}[SectionName];

type UpdateValueProps = FeVarbValueInfo & IdOfSectionToSaveProp;

// type UpdateValueProps = {
//   [SN in SectionName]: {
//     [VN in VarbName<SN>]: {
//       value: VarbValue<SN, VN>;
//     } & FeVarbInfoNext<SN, VN> &
//       IdOfSectionToSaveProp;
//   }[VarbName<SN>];
// }[SectionName];

interface UpdateContentValueProps
  extends VarbContentInfo,
    IdOfSectionToSaveProp {
  noSolve?: boolean;
}
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

export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

export function isSectionActionName(value: any): value is SectionActionName {
  return sectionActionNames.includes(value);
}

type SavableActionName = SavableActions["type"];
type SavableActions = Extract<StateAction, { idOfSectionToSave?: string }>;

const savableActionNames = Arr.extractStrict(sectionActionNames, [
  "addChild",
  "removeSelf",
  "resetSelfToDefault",
  "updateValues",
  "updateValue",
  "updateValueFromContent",
] as const);
export function isSavableActionName(value: any): value is SavableActionName {
  return savableActionNames.includes(value);
}
function isSavableAction(
  value: StateAction
): value is StateActionsMap[SavableActionName] {
  return savableActionNames.includes(value.type as any);
}

export type SectionActionProps<T extends SectionActionName> = ActionPropsMap[T];

type ReducerActions = {
  [AN in SectionActionName]: (prop: ActionPropsMap[AN]) => void;
};

export const mainStateReducer: React.Reducer<MainState, StateAction> = (
  currentState,
  action
) => {
  const solverSections = new SolverSections({
    sectionsShare: { sections: currentState.stateSections },
    solveShare: { solveState: currentState.solveState },
  });

  const reducerActions: ReducerActions = {
    makeEmptyMain: () => {
      const main = solverSections.oneAndOnly("main");
      main.loadSelfAndSolve(makeEmptyMain());
    },
    doLogin: () => {
      const main = solverSections.oneAndOnly("main");
      main.loadSelfAndSolve(defaultMaker.makeSectionPack("main"));
      const feStore = main.onlyChild("feStore");
      feStore.basic.updateValues({ userDataStatus: "loading" });
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
    },
    updateValues: (props) => {
      const section = solverSections.solverSection(props);
      section.updateValues(props.values);
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
      if (props.noSolve) {
        varb.updaterVarb.updateValue(value);
      } else {
        varb.editorUpdateAndSolve(value);
      }
    },

    addToStore: (props) => solverSections.feStore.addToStore(props),
    removeFromStore: (props) => solverSections.feStore.removeFromStore(props),
    removeFromStoreByDbId: (props) =>
      solverSections.feStore.removeFromStoreByDbId(props),
    saveAndOverwriteToStore: ({ feInfo }) =>
      solverSections.saveAndOverwriteToStore(feInfo),
    copyInStore: (props) => solverSections.feStore.copyInStore(props),
    archiveDeal: ({ feId }) => solverSections.archiveDeal(feId),
    loadAndShowArchivedDeals: ({ archivedDeals }) =>
      solverSections.loadAndShowArchivedDeals(archivedDeals),
    removeStoredDeal: ({ dbId }) => solverSections.removeStoredDeal(dbId),
    activateDeal: (props) => solverSections.activateDealAndSolve(props),
    addActiveDeal: ({ dealMode }) => solverSections.addActiveDeal(dealMode),
    doDealCompare: () => solverSections.doDealCompare(),
  };

  if (isSavableAction(action)) {
    if (action.idOfSectionToSave) {
      solverSections.feStore.addChangeToSave(action.idOfSectionToSave, {
        changeName: "update",
      });
    }
  }

  reducerActions[action.type](action as any);
  return new MainState({
    stateSections: solverSections.stateSections,
    solveState: solverSections.solveState,
  });
};
