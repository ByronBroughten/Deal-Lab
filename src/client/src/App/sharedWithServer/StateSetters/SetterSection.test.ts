import { makeDefaultProperty } from "../defaultMaker/makeDefaultProperty";
import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { PathSectionName } from "../SectionsMeta/sectionPathContexts/sectionPathNames";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { SetterTesterSection } from "./TestUtils/SetterTesterSection";

// loadSelfSectionPack
// replaceChildArrs
// replaceWithDefault, resetToDefault

describe("SetterSection", () => {
  // removing just deal doesn't seem to work for some reason.
  const sectionPathNames = ["propertyFocal", "mgmtFocal", "dealFocal"] as const;
  type PathName = typeof sectionPathNames[number];
  type SnTesterProps<TN extends PathName> = {
    tester: SetterTesterSection<PathSectionName<TN>>;
  };
  type FnWithSnProp<TN extends PathName = PathName> = (
    props: SnTesterProps<TN>
  ) => void;
  function runSectionNames(fn: FnWithSnProp) {
    for (const pathName of sectionPathNames) {
      fn({ tester: SetterTesterSection.initByPathName(pathName) });
    }
  }
  it("should remove its own section", () => {
    runSectionNames(({ tester }) => {
      const { parent, feInfo } = tester;
      const childName = parent.get.sectionChildName(feInfo);
      const preCounts = parent.childCounts(childName);
      tester.setter.removeSelf();

      const postCounts = parent.childCounts(childName);

      expect(parent.get.sectionIsChild(feInfo)).toBe(false);
      expect(postCounts.childIds).toBe(preCounts.childIds - 1);
      expect(postCounts.allSectionChildren).toBe(
        preCounts.allSectionChildren - 1
      );
    });
  });
  it("should load a sectionPack", () => {
    const pathName = "propertyFocal";
    const tester = SetterTesterSection.initByPathName(pathName);
    const childName = "unit";
    const numChildrenInit = tester.get.childFeIds(childName);
    const numChildrenNext = 3;
    expect(numChildrenInit).not.toBe(numChildrenNext);

    const preChildCounts = tester.childCounts(childName);
    const childCountDifference = numChildrenNext - preChildCounts.childIds;

    const packVarbs = {
      price: numObj(257801),
      displayName: stringObj("New Title"),
    } as const;

    const packBuilder = PackBuilderSection.loadAsOmniChild(
      makeDefaultProperty()
    );
    packBuilder.updateValues(packVarbs);

    for (let i = 0; i < numChildrenNext; i++) {
      packBuilder.addChild(childName);
    }

    const sectionPack = packBuilder.makeSectionPack();
    tester.setter.loadSelfSectionPack(sectionPack);

    const { getter } = tester;

    const postChildCounts = tester.childCounts(childName);

    expect(getter.dbId).toBe(sectionPack.dbId);
    expect(postChildCounts.childIds).toBe(numChildrenNext);
    expect(postChildCounts.allSectionChildren).toBe(
      preChildCounts.allSectionChildren + childCountDifference
    );
    expect(getter.value("displayName")).toEqual(packVarbs["displayName"]);
    expect(getter.value("price", "numObj").mainText).toEqual(
      packVarbs.price.mainText
    );
  });
  describe("operations with children", () => {
    type SectionChildNameProps<SN extends SectionNameByType<"hasChild">> = {
      childName: ChildName<SN>;
      tester: SetterTesterSection<SN>;
    };
    type SectionChildPropsFn<
      SN extends SectionNameByType<"hasChild"> = SectionNameByType<"hasChild">
    > = (props: SectionChildNameProps<SN>) => void;

    function runWithNames(fn: SectionChildPropsFn): void {
      const sectionAndChildNames = [
        ["dealFocal", ["dealOutputList"]],
        ["propertyFocal", ["unit"]],
      ] as const;
      for (const [pathName, childNames] of sectionAndChildNames) {
        for (const childName of childNames) {
          fn({
            tester: SetterTesterSection.initByPathName(pathName) as any,
            childName,
          });
        }
      }
    }
    it("should add a child to state", () => {
      runWithNames(({ tester, childName }) => {
        const preCounts = tester.childCounts(childName);
        tester.setter.addChild(childName);
        const postCounts = tester.childCounts(childName);

        expect(postCounts.childIds).toBe(preCounts.childIds + 1);
        expect(postCounts.allSectionChildren).toBe(
          preCounts.allSectionChildren + 1
        );
      });
    });
    it("should get the child it adds", () => {
      runWithNames(({ tester, childName }) => {
        const preChildIds = tester.get.childFeIds(childName);

        const { setter } = tester;
        const child = setter.addAndGetChild(childName);

        expect(preChildIds).not.toContain(child.get.feId);
        expect(child.get.selfChildName).toBe(childName);

        const postChildIds = tester.get.childFeIds(childName);
        expect(postChildIds).toContain(child.get.feId);
      });
    });
    it("should remove a child from state", () => {
      runWithNames(({ tester, childName }) => {
        tester.setter.addChild(childName);
        const { feId: childId } = tester.get.youngestChild(childName);
        const childInfo = { childName, feId: childId } as const;
        expect(tester.get.hasChild(childInfo)).toBe(true);

        const preCounts = tester.childCounts(childName);

        tester.setter.removeChild(childInfo);

        const postCounts = tester.childCounts(childName);
        expect(tester.get.hasChild(childInfo)).toBe(false);
        expect(postCounts.childIds).toBe(preCounts.childIds - 1);
        expect(postCounts.allSectionChildren).toBe(
          preCounts.allSectionChildren - 1
        );
      });
    });
    it("should remove all children of a childName from state", () => {
      runWithNames(({ tester, childName }) => {
        tester.setter.addChild(childName);
        tester.setter.addChild(childName);
        const preCounts = tester.childCounts(childName);

        tester.setter.removeChildren(childName);

        const postCounts = tester.childCounts(childName);
        expect(postCounts.childIds).toBe(0);
        expect(postCounts.allSectionChildren).toBe(
          preCounts.allSectionChildren - preCounts.childIds
        );
      });
    });
  });
});
