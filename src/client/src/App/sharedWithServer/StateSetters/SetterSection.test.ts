import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetSections } from "../stateClassHooks/useSections";
import { SectionsShare } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSection } from "../StateGetters/GetterSection";
import { SetterSection } from "./SetterSection";
import {
  makeSetterTestProps,
  SectionsTestState,
} from "./TestUtils/SetSectionsTester";

// loadSelfSectionPack
// loadChildPackArrs
// replaceWithDefault, resetToDefault

describe("SetterSection", () => {
  let state: SectionsTestState;
  let setSections: SetSections;

  function setterFromState<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): SetterSection<SN> {
    return new SetterSection({
      ...feInfo,
      ...SetterSection.initSectionsProps({
        setSections,
        sections: state.sections,
      }),
    });
  }
  function sectionsSharePropFromState(): { sectionsShare: SectionsShare } {
    return { sectionsShare: { sections: state.sections } };
  }
  function getLastSectionInfo<SN extends SectionName>(
    sectionName: SN
  ): FeSectionInfo<SN> {
    const list = new GetterList({
      sectionName,
      ...sectionsSharePropFromState(),
    });
    const { feInfo } = list.last;
    return feInfo;
  }
  function getterSectionFromState<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): GetterSection<SN> {
    return new GetterSection({ ...feInfo, ...sectionsSharePropFromState() });
  }

  beforeEach(() => {
    ({ state, setSections } = makeSetterTestProps());
  });
  function childCountsFromState<SN extends SectionName<"hasChild">>(
    feInfo: FeSectionInfo<SN>,
    childName: ChildName<SN>
  ) {
    const getter = getterSectionFromState(feInfo);
    return {
      childIds: getter.childFeIds(childName).length,
      childSections: getter.childList(childName).length,
    };
  }
  it("should remove its own section", () => {
    const sectionName = "property";
    const feInfo = getLastSectionInfo(sectionName);
    const { parent } = getterSectionFromState(feInfo);
    const parentInfo = parent.feInfo;
    const preCounts = childCountsFromState(parentInfo, sectionName);

    const setter = setterFromState(feInfo);
    setter.removeSelf();

    const postParent = getterSectionFromState(parentInfo);
    const postCounts = childCountsFromState(parentInfo, sectionName);
    expect(postParent.hasChild(feInfo)).toBe(false);
    expect(postCounts.childIds).toBe(preCounts.childIds - 1);
    expect(postCounts.childSections).toBe(preCounts.childSections - 1);
  });
  describe("operations with children", () => {
    type SectionChildNameProps<SN extends SectionName<"hasChild">> = {
      sectionName: SN;
      childName: ChildName<SN>;
      feInfo: FeSectionInfo<SN>;
    };
    type SectionChildPropsFn<
      SN extends SectionName<"hasChild"> = SectionName<"hasChild">
    > = (props: SectionChildNameProps<SN>) => void;

    function runWithNames(fn: SectionChildPropsFn): void {
      const sectionAndChildNames = [
        ["mgmt", ["upfrontCostList"]],
        ["property", ["unit"]],
      ] as const;
      for (const [sectionName, childNames] of sectionAndChildNames) {
        for (const childName of childNames) {
          fn({
            sectionName,
            childName,
            feInfo: getLastSectionInfo(sectionName),
          });
        }
      }
    }
    it("should add a child to state and get it", () => {
      runWithNames(({ feInfo, childName }) => {
        const preGetter = getterSectionFromState(feInfo);
        const preChildIds = preGetter.childFeIds(childName);

        const setter = setterFromState(feInfo);
        const child = setter.addAndGetChild(childName);

        expect(preChildIds).not.toContain(child.get.feId);
        expect(child.get.sectionName).toBe(childName);

        const postGetter = getterSectionFromState(feInfo);
        const postChildIds = postGetter.childFeIds(childName);
        expect(postChildIds).toContain(child.get.feId);
      });
    });
    it("should add a child to state", () => {
      runWithNames(({ feInfo, childName }) => {
        const preCounts = childCountsFromState(feInfo, childName);
        const setter = setterFromState(feInfo);
        setter.addChild(childName);
        const postCounts = childCountsFromState(feInfo, childName);

        expect(postCounts.childIds).toBe(preCounts.childIds + 1);
        expect(postCounts.childSections).toBe(preCounts.childSections + 1);
      });
    });
    it("should remove a child from state", () => {
      runWithNames(({ feInfo, childName }) => {
        const preSetter = setterFromState(feInfo);
        preSetter.addChild(childName);
        const { feInfo: childInfo } = preSetter.get.youngestChild(childName);

        const preCounts = childCountsFromState(feInfo, childName);
        const preGetter = getterSectionFromState(feInfo);
        expect(preGetter.hasChild(childInfo)).toBe(true);

        const setter = setterFromState(feInfo);
        setter.removeChild(childInfo);

        const postCounts = childCountsFromState(feInfo, childName);
        const postGetter = getterSectionFromState(feInfo);
        expect(postGetter.hasChild(childInfo)).toBe(false);
        expect(postCounts.childIds).toBe(preCounts.childIds - 1);
        expect(postCounts.childSections).toBe(preCounts.childSections - 1);
      });
    });
    it("should remove all children of a childName from state", () => {
      runWithNames(({ feInfo, childName }) => {
        const preSetter = setterFromState(feInfo);
        preSetter.addChild(childName);
        preSetter.addChild(childName);
        const preCounts = childCountsFromState(feInfo, childName);

        const setter = setterFromState(feInfo);
        setter.removeChildren(childName);

        const postCounts = childCountsFromState(feInfo, childName);
        expect(postCounts.childIds).toBe(0);
        expect(postCounts.childSections).toBe(
          preCounts.childSections - preCounts.childIds
        );
      });
    });
  });
});
