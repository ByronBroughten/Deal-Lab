import { ContentState } from "draft-js";
import { EditorUpdaterVarb } from "../../../modules/EditorUpdaterVarb";
import { AddToStoreProps } from "../../../modules/FeStore/SolverFeStore";
import { UserData } from "../../apiQueriesShared/validateUserData";
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
import { SolvePrepperSection } from "../../StateSolvers/SolvePreppers/SolvePrepperSection";
import { SolvePrepperVarb } from "../../StateSolvers/SolvePreppers/SolvePrepperVarb";
import { AddChildOptions } from "../../StateUpdaters/UpdaterSection";
import { Arr } from "../../utils/Arr";
import { Merge } from "../../utils/Obj/merge";
import { TopOperator } from "./../../StateSolvers/TopOperator";

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
  "solve",
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
  const topOperator = new TopOperator({
    sectionsShare: { sections: currentState.stateSections },
    solveShare: { solveState: currentState.solveState },
  });
  const solvePrepper = topOperator.prepper;
  const prepStore = topOperator.prepStore;

  const prepperSection = <SN extends SectionName>(
    props: FeSectionInfo<SN>
  ): SolvePrepperSection<SN> => {
    return solvePrepper.prepperSection(props);
  };

  const prepperVarb = <SN extends SectionName>(
    props: FeVarbInfo<SN>
  ): SolvePrepperVarb<SN> => {
    return solvePrepper.prepperVarb(props);
  };

  // figure out which of these should be saved right away
  const reducerActions: ReducerActions = {
    makeEmptyMain: () => {
      topOperator.makeEmptyMainAndSolve();
    },
    doLogin: () => {
      topOperator.doLoginAndSolve();
    },
    loadUserData: ({ userData }) => topOperator.loadUserDataAndSolve(userData),
    incrementGetUserDataTry: () => topOperator.incrementGetUserDataTry(),
    onChangeIdle: () => topOperator.onChangeIdle(),
    finishSave: (props) => topOperator.prepStore.finishSave(props),
    addChild: ({ feInfo, childName, options }) => {
      const section = prepperSection(feInfo);
      section.addChild(childName, options);
    },
    removeSelf: (props) => {
      const section = prepperSection(props);
      section.removeSelf();
    },
    resetSelfToDefault: (props) => {
      const section = prepperSection(props);
      section.resetToDefault();
    },
    loadSelfCopyFromStore: (props) => {
      topOperator.loadCopyFromStore(props);
    },
    updateValues: (props) => {
      const section = prepperSection(props);
      section.updateValues(props.values);
    },
    updateValue: (props) => {
      const varb = prepperVarb(props);
      varb.directUpdate(props.value);
    },
    updateValueFromContent: (props) => {
      // Needed because previous value is required for new value
      // Also, keeping this here so it's on the front-end
      const { contentState } = props;

      const varb = prepperVarb(props);
      const editorVarb = new EditorUpdaterVarb(
        varb.getterVarbBase.getterVarbProps
      );

      const value = editorVarb.valueFromContentState(contentState);
      if (props.noSolve) {
        varb.updaterVarb.updateValue(value);
      } else {
        varb.editorUpdate(value);
      }
    },
    addToStore: (props) => prepStore.addToStore(props),
    removeFromStore: (props) => prepStore.removeFromStore(props),
    removeFromStoreByDbId: (props) => prepStore.removeFromStoreByDbId(props),
    saveAndOverwriteToStore: ({ feInfo }) =>
      topOperator.saveAndOverwriteToStore(feInfo),
    copyInStore: (props) => prepStore.copyInStore(props),
    archiveDeal: ({ feId }) => topOperator.archiveDeal(feId),
    loadAndShowArchivedDeals: ({ archivedDeals }) =>
      topOperator.loadAndShowArchivedDeals(archivedDeals),
    removeStoredDeal: ({ dbId }) => topOperator.removeStoredDealAndSolve(dbId),
    activateDeal: (props) => topOperator.activateDealAndSolve(props),
    addActiveDeal: ({ dealMode }) =>
      topOperator.addActiveDealAndSolve(dealMode),
    doDealCompare: () => topOperator.doDealCompareAndSolve(),
    solve: () => topOperator.solve(),
  };

  if (isSavableAction(action)) {
    if (action.idOfSectionToSave) {
      prepStore.addChangeToSave(action.idOfSectionToSave, {
        changeName: "update",
      });
    }
  }

  reducerActions[action.type](action as any);
  return topOperator.makeMainState();
};
