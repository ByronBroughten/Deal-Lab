import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { dbNumObj } from "../SectionMetas/relSections/rel/valueMeta/NumObj";

describe(`addSection`, () => {
  let next: Analyzer;
  let propertyDbId: string;
  let unitId: string;
  let propertyEntry: DbEntry;
  const priceNumber = 500000;
  const squareFeetNumber = 10000;
  const rentNumber = 5000;
  const propertyProps = ["property", "propertyGeneral"] as const;

  beforeEach(async () => {
    next = Analyzer.initAnalyzer();
    propertyDbId = Analyzer.makeId();
    unitId = Analyzer.makeId();
    propertyEntry = {
      dbId: propertyDbId,
      dbSections: {
        property: [
          {
            dbId: propertyDbId,
            childDbIds: {
              unit: [unitId],
            },
            dbVarbs: {
              price: dbNumObj(priceNumber),
              squareFeet: dbNumObj(squareFeetNumber),
            },
          },
        ],
        unit: [
          {
            dbId: unitId,
            childDbIds: {},
            dbVarbs: {
              rent: dbNumObj(rentNumber),
            },
          },
        ],
      },
    };
  });

  it("should not have a section", () => {
    expect(next.sectionArr("property").length).toBe(0);
  });
  it("should have a section", () => {
    next = next.addSectionAndSolve(...propertyProps);
    expect(next.sectionArr("property").length).toBe(1);
  });
  it("should have its dbEntry dbId", () => {
    next = next.addSectionAndSolve(...propertyProps, {
      dbEntry: propertyEntry,
    });
    const property = next.lastSection("property");
    expect(property.dbId === propertyDbId);
  });
  it("should have its dbEntry values", () => {
    next = next.addSectionAndSolve(...propertyProps, {
      dbEntry: propertyEntry,
    });
    const property = next.lastSection("property");
    expect(property.value("price", "numObj").number).toBe(priceNumber);
    expect(property.value("squareFeet", "numObj").number).toBe(
      squareFeetNumber
    );
  });
  it("should have its child", () => {
    next = next.addSectionAndSolve(...propertyProps, {
      dbEntry: propertyEntry,
    });
    const property = next.lastSection("property");
    property.childFeIds("unit");
  });

  it("should solve", () => {
    next.addSectionAndSolve(...propertyProps);
  });
});
