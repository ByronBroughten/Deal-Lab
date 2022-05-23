import { SetStateAction } from "react";
import { SetSections } from "../../modules/useSections";
import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { FeSections } from "../SectionsState/SectionsState";
import { SectionSetter } from "./SectionSetter";

type State = { sections: FeSections };
describe("SectionSetter", () => {
  let state: State;
  let sections: FeSections;
  beforeEach(() => {
    sections = FeSections.initFromSectionPack(defaultMaker.make("main"));
    state = { sections };
  });
  const setSectionsTest: SetSections = (
    value: SetStateAction<FeSections>
  ): void => {
    if (value instanceof FeSections) {
      state.sections = value;
    } else if (typeof value === "function") {
      state.sections = value(state.sections);
    } else throw new Error("Value invalid");
  };
  it("should add and set a child", () => {
    const childName = "upfrontCostList";

    const preMgmt = sections.list("mgmt").first;
    const preChildCount = preMgmt.childFeIds(childName).length;
    const preSectionCount = sections.list(childName).length;

    const setter = new SectionSetter({
      setSections: setSectionsTest,
      ...preMgmt.info,
      shared: { sections },
    });

    setter.addChild(childName);
    const nextSections = state.sections;

    const postMgmt = nextSections.section(preMgmt.info);
    const postChildCount = postMgmt.childFeIds(childName).length;
    const postSectionCount = nextSections.list(childName).length;

    expect(postChildCount).toBe(preChildCount + 1);
    expect(postSectionCount).toBe(preSectionCount + 1);
  });
});
