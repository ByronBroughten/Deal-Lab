import { pick } from "lodash";
import { SectionPack } from "../../Analyzer/SectionPack";
import { dbNumObj } from "../../SectionMetas/baseSections/baseValues/NumObj";
import { Obj } from "../../utils/Obj";
import { SectionPackBuilderNext } from "./SectionPackBuilder";

describe("SectionPackBuilder", () => {
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
    const main = new SectionPackBuilderNext();

    const property = main.addAndGetDescendant(
      ["analysis", "propertyGeneral", "property"] as const,
      { dbVarbs: dbVarbs.property }
    );
    property.addChild("upfrontCostList", { dbVarbs: dbVarbs.upfrontCostList });
    property.addChild("ongoingCostList", { dbVarbs: dbVarbs.ongoingCostList });

    const { selfSectionPack } = property;

    expect(SectionPack.isRaw(selfSectionPack)).toBe(true);

    const { rawSections } = selfSectionPack;

    for (const sectionName of Obj.keys(dbVarbs)) {
      const sectionPackVarbs = rawSections[sectionName][0].dbVarbs;
      const sectionVarbs = dbVarbs[sectionName];
      expect(pick(sectionPackVarbs, Obj.keys(sectionVarbs))).toEqual(
        sectionVarbs
      );
    }
  });
});
