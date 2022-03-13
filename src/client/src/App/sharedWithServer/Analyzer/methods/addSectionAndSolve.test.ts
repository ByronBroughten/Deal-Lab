import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { dbNumObj } from "../SectionMetas/relSections/rel/valueMeta/NumObj";

function makePropertyEntry(
  propertyId: string,
  unitId: string,
  propertyValues: {
    price: number;
    sqft: number;
    targetRent: number;
  }
): DbEntry {
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
            sqft: dbNumObj(propertyValues.sqft),
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

describe("Analyzer.addSection", () => {
  const simpleProps = ["property", "propertyGeneral"] as const;
  const propertyValues = {
    price: 500000,
    sqft: 10000,
    targetRent: 5000,
  } as const;

  let entryProps: [...typeof simpleProps, { dbEntry: DbEntry }];
  let numPropertiesInitial: number;
  let finalValues: {
    totalInvestment: number;
    cashFlowMonthly: number;
  };
  let next: Analyzer;
  let propertyDbId: string;
  let unitId: string;

  beforeEach(async () => {
    propertyDbId = Analyzer.makeId();
    unitId = Analyzer.makeId();
    entryProps = [
      ...simpleProps,
      { dbEntry: makePropertyEntry(propertyDbId, unitId, propertyValues) },
    ];

    next = Analyzer.initAnalyzer();
    numPropertiesInitial = next.sectionArr("property").length;
    finalValues = {
      totalInvestment: next.section("final").value("totalInvestment", "numObj")
        .numberStrict,
      cashFlowMonthly: next.section("final").value("cashFlowMonthly", "numObj")
        .numberStrict,
    };
  });
  it("should have one more section", () => {
    next = next.addSectionAndSolve(...simpleProps);
    expect(next.sectionArr("property").length).toBe(numPropertiesInitial + 1);
  });
  it("should have its dbEntry dbId", () => {
    next = next.addSectionAndSolve(...entryProps);
    const property = next.lastSection("property");
    expect(property.dbId === propertyDbId);
  });
  it("should have its dbEntry values", () => {
    next = next.addSectionAndSolve(...entryProps);
    const property = next.lastSection("property");
    expect(property.value("price", "numObj").number).toBe(propertyValues.price);
    expect(property.value("sqft", "numObj").number).toBe(propertyValues.sqft);
  });
  it("should have one child", () => {
    next = next.addSectionAndSolve(...entryProps);
    const property = next.lastSection("property");
    property.childFeIds("unit");
  });
  it("should solve", () => {
    next = next.addSectionAndSolve(...entryProps);
    const nextTotalInvestment = next
      .section("final")
      .value("totalInvestment", "numObj").number;
    const nextCashFlowMonthly = next
      .section("final")
      .value("cashFlowMonthly", "numObj").number;
    expect(nextTotalInvestment).toBe(
      finalValues.totalInvestment + propertyValues.price
    );
    expect(nextCashFlowMonthly).toBe(
      finalValues.cashFlowMonthly + propertyValues.targetRent
    );
  });
});
