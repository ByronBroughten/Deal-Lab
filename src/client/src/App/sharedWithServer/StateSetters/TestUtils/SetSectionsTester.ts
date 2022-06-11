import { SetStateAction } from "react";
import { FeSectionInfo, VarbInfo } from "../../SectionsMeta/Info";
import { SimpleVarbNames } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { SetSections } from "../../stateClassHooks/useSections";
import { SectionsShare } from "../../StateGetters/Bases/GetterSectionsBase";
import { GetterList } from "../../StateGetters/GetterList";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { StateSections } from "../../StateSections/StateSectionsNext";
import { SolverSection } from "../../StateSolvers/SolverSection";
import { SetterSections } from "../SetterSections";

export type SectionsTestState = { sections: StateSections };
type SetterTestProps = {
  state: SectionsTestState;
  setSections: SetSections;
};
export function makeSetterTestProps(): SetterTestProps {
  // initSectionsFromDefaultMain with added descendants.
  const descendantsToAdd = [
    ["propertyGeneral", "property", "unit"],
    ["financing", "loan"],
  ] as const;

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

export class SetterTester {
  readonly state: { sections: StateSections };
  constructor() {
    this.state = {
      sections: SolverSection.initSectionsFromDefaultMain(),
    };
  }
  initSetterSectionsProps() {
    return SetterSections.initSectionsProps({
      ...this.sectionsAndSetSections,
    });
  }
  get sectionsAndSetSections() {
    return {
      sections: this.state.sections,
      setSections: this.makeTestSetSections(),
    };
  }
  makeTestSetSections(): SetSections {
    return (value: SetStateAction<StateSections>): void => {
      if (value instanceof StateSections) {
        this.state.sections = value;
      } else if (typeof value === "function") {
        this.state.sections = value(this.state.sections);
      } else throw new Error(`value "${value}" is invalid.`);
    };
  }
  get sectionsSharePropFromState(): { sectionsShare: SectionsShare } {
    return { sectionsShare: { sections: this.state.sections } };
  }
  getLastVarbInfo<SN extends SectionName>({
    sectionName,
    varbName,
  }: SimpleVarbNames<SN>): VarbInfo<SN> {
    return {
      ...this.getLastSectionInfo(sectionName),
      varbName,
    };
  }
  getLastSectionInfo<SN extends SectionName>(
    sectionName: SN
  ): FeSectionInfo<SN> {
    const list = new GetterList({
      sectionName,
      ...this.sectionsSharePropFromState,
    });
    const { feInfo } = list.last;
    return feInfo;
  }
  getterSectionFromState<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): GetterSection<SN> {
    return new GetterSection({
      ...feInfo,
      ...this.sectionsSharePropFromState,
    });
  }
  getterVarbFromState<SN extends SectionName>(
    feInfo: VarbInfo<SN>
  ): GetterVarb<SN> {
    return new GetterVarb({
      ...feInfo,
      ...this.sectionsSharePropFromState,
    });
  }
}
