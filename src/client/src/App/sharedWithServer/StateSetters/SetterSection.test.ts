import { SetStateAction } from "react";
import { SetSections } from "../../modules/useSections";
import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { StateSections } from "../StateSections/StateSectionsNext";
import { SetterSection } from "./SetterSection";

type State = { sections: StateSections };
describe("SetterSection", () => {
  let state: State;
  let sections: StateSections;
  beforeEach(() => {
    sections = defaultMaker.initSectionsFromMain();
    state = { sections };
  });
  const setSectionsTest: SetSections = (
    value: SetStateAction<StateSections>
  ): void => {
    if (value instanceof StateSections) {
      state.sections = value;
    } else if (typeof value === "function") {
      state.sections = value(state.sections);
    } else throw new Error("Value invalid");
  };
  it("should add and set a child", () => {
    const sectionName = "mgmt";
    const childName = "upfrontCostList";

    const preSection = sections.rawSectionList(sectionName)[0];
    const preChildCount = preSection.childFeIds[childName].length;
    const preSectionCount = sections.rawSectionList(childName).length;

    const setter = new SetterSection({
      setSections: setSectionsTest,
      sectionName,
      feId: preSection.feId,
      sectionsShare: { sections },
    });

    setter.addChild(childName);
    const nextSections = state.sections;

    const postSection = nextSections.rawSection({
      sectionName,
      feId: preSection.feId,
    });
    const postChildCount = postSection.childFeIds[childName].length;
    const postSectionCount = nextSections.rawSectionList(childName).length;

    expect(postChildCount).toBe(preChildCount + 1);
    expect(postSectionCount).toBe(preSectionCount + 1);
  });
});
