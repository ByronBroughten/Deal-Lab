import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { FeInfo, Inf } from "../SectionMetas/Info";
import { dbNumObj } from "../SectionMetas/relSections/rel/valueMeta/NumObj";

function makePropertyEntry(propertyValues: {
  price: number;
  title: string;
  targetRent: number;
}): DbEntry {
  const propertyId = Analyzer.makeId();
  const unitId = Analyzer.makeId();

  return {
    dbId: propertyId,
    dbSections: {
      property: [
        {
          dbId: propertyId,
          childDbIds: {
            unit: [unitId],
          },
          dbVarbs: {
            price: dbNumObj(propertyValues.price),
            title: propertyValues.title,
          },
        },
      ],
      unit: [
        {
          dbId: unitId,
          childDbIds: {},
          dbVarbs: {
            targetRentMonthly: dbNumObj(propertyValues.targetRent),
          },
        },
      ],
    },
  };
}

describe("Analyzer.updateValues", () => {
  let analyzer: Analyzer;
  let propertyInfo: FeInfo;

  beforeEach(() => {
    analyzer = Analyzer.initAnalyzer();
    analyzer.addSectionAndSolve("property", "propertyGeneral", {
      dbEntry: makePropertyEntry({
        price: 500000,
        title: "Original title",
        targetRent: 5000,
      }),
    });
    propertyInfo = analyzer.lastSection("property").feInfo;
  });

  it("should update the value", () => {
    analyzer.updateValueDirectly(
      Inf.feVarb("title", propertyInfo),
      "Next title"
    );
  });
});
