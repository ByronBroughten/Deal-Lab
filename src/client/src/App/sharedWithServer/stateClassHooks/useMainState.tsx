import React from "react";
import { react } from "../../utils/react";
import { MainState } from "../MainState";
import { SolveState } from "../StateSections/SolveState";
import { StateSections } from "../StateSections/StateSections";
import { TopOperator } from "../StateSolvers/TopOperator";
import { mainStateReducer, StateAction } from "./useMainState/mainStateReducer";
import {
  SectionsStore,
  StateMissingFromStorageError,
  useLocalSectionsStore,
} from "./useMainState/SectionsStore";

type UseMainStateProps = {
  prePopulatedSections?: StateSections;
  storeSectionsLocally?: boolean;
};

export type MainStateDispatch = React.Dispatch<StateAction>;
interface MainStateAndDispatch {
  mainState: MainState;
  mainDispatch: MainStateDispatch;
}

function useMainStateCore(
  initMainState: () => MainState
): [MainState, MainStateDispatch] {
  const [mainState, mainDispatch] = React.useReducer(
    mainStateReducer,
    MainState.initEmpty(),
    initMainState
  );
  return [mainState, mainDispatch];
}

export function useMainState({
  prePopulatedSections,
  storeSectionsLocally = false,
}: UseMainStateProps = {}): MainStateAndDispatch {
  const [mainState, mainDispatch] = useMainStateCore(() => {
    const initSections = initializeAnalyzerSections(prePopulatedSections);
    return MainState.initEmpty({ stateSections: initSections });
  });
  useLocalSectionsStore({
    storeSectionsLocally,
    sections: mainState.stateSections,
  });
  return {
    mainState,
    mainDispatch,
  };
}

function initializeAnalyzerSections(prePopulatedSections?: StateSections) {
  if (prePopulatedSections) return prePopulatedSections;
  else
    try {
      return SectionsStore.getStoredSections();
    } catch (err) {
      if (err instanceof StateMissingFromStorageError) {
        return TopOperator.initWithEmptyMainAndSolve().stateSections;
      } else throw err;
    }
}

export const [MainDispatchContext, useMainDispatch] =
  react.makeContextUseContext("MainDispatchContext", {} as MainStateDispatch);

export const [MainStateContext, useMainStateContext] =
  react.makeContextUseContext("SectionContext", MainState.initEmpty());

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", StateSections.initEmpty());

export const [SolveIdsContext, useSolveStateContext] =
  react.makeContextUseContext("SolveIdsContext", SolveState.initEmpty());

export function MainStateProvider({ children }: { children: React.ReactNode }) {
  const { mainState, mainDispatch } = useMainState();
  return (
    <MainStateContext.Provider value={mainState}>
      <SectionsContext.Provider value={mainState.stateSections}>
        <SolveIdsContext.Provider value={mainState.solveState}>
          <MainDispatchContext.Provider value={mainDispatch}>
            {children}
          </MainDispatchContext.Provider>
        </SolveIdsContext.Provider>
      </SectionsContext.Provider>
    </MainStateContext.Provider>
  );
}
