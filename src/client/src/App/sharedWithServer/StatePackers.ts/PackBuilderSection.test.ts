import { pick } from "lodash";
import { sectionPackS } from "../SectionPack/SectionPack";
import { dbNumObj } from "../SectionsMeta/baseSections/baseValues/NumObj";
import { Obj } from "../utils/Obj";
import { PackBuilderSection } from "./PackBuilderSection";

describe("PackBuilderSection", () => {
  const dbVarbs = {
    property: {
      title: "String",
      price: dbNumObj(200000),
      taxesOngoingSwitch: "yearly",
    },
    upfrontCostList: {
      title: "Repairs",
    },
    ongoingCostList: {
      title: "Utilities",
    },
  } as const;

  it("should make a sectionPack with the added values and children", () => {
    const main = PackBuilderSection.initAsMain();
    const property = main.addAndGetDescendant(
      ["deal", "propertyGeneral", "property"] as const,
      { dbVarbs: dbVarbs.property }
    );
    property.addChild("upfrontCostList", { dbVarbs: dbVarbs.upfrontCostList });
    property.addChild("ongoingCostList", { dbVarbs: dbVarbs.ongoingCostList });

    const sectionPack = property.makeSectionPack();
    expect(sectionPackS.is(sectionPack)).toBe(true);

    const { rawSections } = sectionPack;

    for (const sectionName of Obj.keys(dbVarbs)) {
      const sectionPackVarbs = rawSections[sectionName][0].dbVarbs;
      const sectionVarbs = dbVarbs[sectionName];
      expect(pick(sectionPackVarbs, Obj.keys(sectionVarbs))).toEqual(
        sectionVarbs
      );
    }
  });
});
