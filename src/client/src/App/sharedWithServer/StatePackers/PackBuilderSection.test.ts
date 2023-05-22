import { pick } from "lodash";
import { isSectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { Obj } from "../utils/Obj";
import { PackBuilderSection } from "./PackBuilderSection";

describe("PackBuilderSection", () => {
  const childVarbs = {
    unit: {
      targetRentMonthly: numObj(2500),
      numBedrooms: numObj(5),
    },
  } as const;
  const propertyVarbs = {
    displayName: stringObj("Some string"),
    purchasePrice: numObj(200000),
    taxesPeriodicSwitch: "yearly",
  } as const;

  it("should make a sectionPack with the added values and children", () => {
    const property = PackBuilderSection.initAsOmniChild("property", {
      sectionValues: propertyVarbs,
    });

    const childNames = Obj.keys(childVarbs);
    for (const childName of childNames) {
      property.addChild(childName, { sectionValues: childVarbs[childName] });
    }

    const sectionPack = property.makeSectionPack();
    expect(isSectionPack(sectionPack)).toBe(true);

    const { rawSections } = sectionPack;

    const spPropertyVarbs = rawSections["property"][0].sectionValues;
    const propertyKeys = Obj.keys(propertyVarbs);
    expect(propertyVarbs).toEqual(pick(spPropertyVarbs, propertyKeys));

    for (const childName of childNames) {
      const childType = property.get.meta.childType(childName);
      const sectionPackVarbs = rawSections[childType][0].sectionValues;
      const sectionVarbs = childVarbs[childName];
      expect(pick(sectionPackVarbs, Obj.keys(sectionVarbs))).toEqual(
        sectionVarbs
      );
    }
  });
});
