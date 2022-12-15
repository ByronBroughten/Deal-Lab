import React from "react";
import { react } from "../../utils/react";
import { StateSections } from "../StateSections/StateSections";
import { SolverSections } from "../StateSolvers/SolverSections";
import { StrictOmit } from "../utils/types";
import { SectionsAction, sectionsReducer } from "./useSections/sectionsReducer";
import {
  SectionsStore,
  StateMissingFromStorageError,
  useLocalSectionsStore,
} from "./useSections/SectionsStore";

export type SetSections = React.Dispatch<React.SetStateAction<StateSections>>;
type UseSectionsProps = {
  prePopulatedSections?: StateSections;
  storeSectionsLocally?: boolean;
};
export type SectionsDispatch = React.Dispatch<SectionsAction>;
export interface SectionsAndControls {
  sectionsDispatch: React.Dispatch<SectionsAction>;
  sections: StateSections;
  setSections: React.Dispatch<React.SetStateAction<StateSections>>;
}

function makeSetSections(
  currentSections: StateSections,
  sectionsDispatch: SectionsDispatch
): SetSections {
  return (value) => {
    if (value instanceof StateSections)
      sectionsDispatch({
        type: "setState",
        sections: value,
      });
    else {
      sectionsDispatch({
        type: "setState",
        sections: value(currentSections),
      });
    }
  };
}

export function useSections(
  initializeSections: () => StateSections
): [StateSections, SetSections, SectionsDispatch] {
  const [sections, sectionsDispatch] = React.useReducer(
    sectionsReducer,
    StateSections.initEmpty(),
    initializeSections
  );
  const setSections = makeSetSections(sections, sectionsDispatch);
  return [sections, setSections, sectionsDispatch];
}

export function useAnalyzerSections({
  prePopulatedSections,
  storeSectionsLocally = false,
}: UseSectionsProps = {}): SectionsAndControls {
  const [sections, setSections, sectionsDispatch] = useSections(() =>
    initializeAnalyzerSections(prePopulatedSections)
  );
  useLocalSectionsStore({
    storeSectionsLocally,
    sections,
  });
  return {
    sections,
    setSections,
    sectionsDispatch,
  };
}

type UseSectionsReturn = ReturnType<typeof useAnalyzerSections>;
export type SectionsValue = StrictOmit<UseSectionsReturn, "sectionsDispatch">;

function initializeAnalyzerSections(prePopulatedSections?: StateSections) {
  if (prePopulatedSections) return prePopulatedSections;
  else
    try {
      return SectionsStore.getStoredSections();
    } catch (err) {
      if (err instanceof StateMissingFromStorageError) {
        return SolverSections.initSectionsFromDefaultMain();
      } else throw err;
    }
}

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", {} as SectionsValue);

export const [SectionsDispatchContext, useSectionsDispatch] =
  react.makeContextUseContext(
    "SectionsDispatchContext",
    {} as SectionsDispatch
  );

type Props = {
  sectionsContext: SectionsAndControls;
  children: React.ReactNode;
};
export function SectionsContextProvider({ sectionsContext, children }: Props) {
  return (
    <SectionsContext.Provider value={sectionsContext}>
      <SectionsDispatchContext.Provider
        value={sectionsContext.sectionsDispatch}
      >
        {children}
      </SectionsDispatchContext.Provider>
    </SectionsContext.Provider>
  );
}
