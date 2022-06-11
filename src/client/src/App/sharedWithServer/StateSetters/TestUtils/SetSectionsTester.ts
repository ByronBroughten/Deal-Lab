import { SetStateAction } from "react";
import { SetSections } from "../../stateClassHooks/useSections";
import { StateSections } from "../../StateSections/StateSectionsNext";
import { SolverSection } from "../../StateSolvers/SolverSection";

export type SectionsTestState = { sections: StateSections };
type SetterTestProps = {
  state: SectionsTestState;
  setSections: SetSections;
};
export function makeSetterTestProps(): SetterTestProps {
  const sections = SolverSection.initSectionsFromDefaultMain();
  const state = { sections };
  const setSections = (value: SetStateAction<StateSections>): void => {
    if (value instanceof StateSections) {
      state.sections = value;
    } else if (typeof value === "function") {
      state.sections = value(state.sections);
    } else throw new Error(`value "${value}" is invalid.`);
  };
  return {
    setSections,
    state,
  };
}
