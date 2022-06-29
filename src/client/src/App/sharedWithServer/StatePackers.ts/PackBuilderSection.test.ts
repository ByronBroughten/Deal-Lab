import { pick } from "lodash";
import { isSectionPack } from "../SectionPack/SectionPack";
import { numObj } from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { Obj } from "../utils/Obj";
import { PackBuilderSection } from "./PackBuilderSection";

describe("PackBuilderSection", () => {
  const childVarbs = {
    upfrontCostList: {
      title: "Repairs",
    },
    ongoingCostList: {
      title: "Utilities",
    },
  } as const;

  const propertyVarbs = {
    title: "String",
    price: numObj(200000),
    taxesOngoingSwitch: "yearly",
  };

  it("should make a sectionPack with the added values and children", () => {
    const property = PackBuilderSection.initAsOmniChild("property", {
      dbVarbs: propertyVarbs,
    });

    const childNames = Obj.keys(childVarbs);
    for (const childName of childNames) {
      property.addChild(childName, { dbVarbs: childVarbs[childName] });
    }

    const sectionPack = property.makeSectionPack();
    expect(isSectionPack(sectionPack)).toBe(true);

    const { rawSections } = sectionPack;

    const spPropertyVarbs = rawSections["property"][0].dbVarbs;
    const propertyKeys = Obj.keys(propertyVarbs);
    expect(pick(propertyVarbs, propertyKeys)).toEqual(spPropertyVarbs);

    for (const childName of childNames) {
      const childType = property.get.meta.childType(childName);
      const sectionPackVarbs = rawSections[childType][0].dbVarbs;
      const sectionVarbs = childVarbs[childName];
      expect(pick(sectionPackVarbs, Obj.keys(sectionVarbs))).toEqual(
        sectionVarbs
      );
    }
  });
});
