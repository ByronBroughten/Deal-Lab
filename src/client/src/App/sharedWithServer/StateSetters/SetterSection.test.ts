import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetterSection } from "./SetterSection";
import { SetterTester } from "./TestUtils/SetSectionsTester";

// loadSelfSectionPack
// loadChildPackArrs
// replaceWithDefault, resetToDefault

// No, I should make SetterTester take a sectionName
//
describe("SetterSection", () => {
  let setterTester: SetterTester;
  beforeEach(() => {
    setterTester = new SetterTester();
  });
  function setterSectionFromState<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): SetterSection<SN> {
    return new SetterSection({
      ...feInfo,
      ...setterTester.initSetterSectionsProps(),
    });
  }
  function childCountsFromState<SN extends SectionName<"hasChild">>(
    feInfo: FeSectionInfo<SN>,
    childName: ChildName<SN>
  ) {
    const getter = setterTester.getterSectionFromState(feInfo);
    return {
      childIds: getter.childFeIds(childName).length,
      childSections: getter.childList(childName).length,
    };
  }
  it("should remove its own section", () => {
    const sectionName = "property";
    const feInfo = setterTester.getLastSectionInfo(sectionName);
    const { parent } = setterTester.getterSectionFromState(feInfo);
    const parentInfo = parent.feInfo;
    const preCounts = childCountsFromState(parentInfo, sectionName);

    const setter = setterSectionFromState(feInfo);
    setter.removeSelf();

    const postParent = setterTester.getterSectionFromState(parentInfo);
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
            feInfo: setterTester.getLastSectionInfo(sectionName),
          });
        }
      }
    }
    it("should add a child to state and get it", () => {
      runWithNames(({ feInfo, childName }) => {
        const preGetter = setterTester.getterSectionFromState(feInfo);
        const preChildIds = preGetter.childFeIds(childName);

        const setter = setterSectionFromState(feInfo);
        const child = setter.addAndGetChild(childName);

        expect(preChildIds).not.toContain(child.get.feId);
        expect(child.get.sectionName).toBe(childName);

        const postGetter = setterTester.getterSectionFromState(feInfo);
        const postChildIds = postGetter.childFeIds(childName);
        expect(postChildIds).toContain(child.get.feId);
      });
    });
    it("should add a child to state", () => {
      runWithNames(({ feInfo, childName }) => {
        const preCounts = childCountsFromState(feInfo, childName);
        const setter = setterSectionFromState(feInfo);
        setter.addChild(childName);
        const postCounts = childCountsFromState(feInfo, childName);

        expect(postCounts.childIds).toBe(preCounts.childIds + 1);
        expect(postCounts.childSections).toBe(preCounts.childSections + 1);
      });
    });
    it("should remove a child from state", () => {
      runWithNames(({ feInfo, childName }) => {
        const preSetter = setterSectionFromState(feInfo);
        preSetter.addChild(childName);
        const { feInfo: childInfo } = preSetter.get.youngestChild(childName);

        const preCounts = childCountsFromState(feInfo, childName);
        const preGetter = setterTester.getterSectionFromState(feInfo);
        expect(preGetter.hasChild(childInfo)).toBe(true);

        const setter = setterSectionFromState(feInfo);
        setter.removeChild(childInfo);

        const postCounts = childCountsFromState(feInfo, childName);
        const postGetter = setterTester.getterSectionFromState(feInfo);
        expect(postGetter.hasChild(childInfo)).toBe(false);
        expect(postCounts.childIds).toBe(preCounts.childIds - 1);
        expect(postCounts.childSections).toBe(preCounts.childSections - 1);
      });
    });
    it("should remove all children of a childName from state", () => {
      runWithNames(({ feInfo, childName }) => {
        const preSetter = setterSectionFromState(feInfo);
        preSetter.addChild(childName);
        preSetter.addChild(childName);
        const preCounts = childCountsFromState(feInfo, childName);

        const setter = setterSectionFromState(feInfo);
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
