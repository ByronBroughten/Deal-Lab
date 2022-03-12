import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { dbNumObj } from "../SectionMetas/relSections/rel/valueMeta/NumObj";

describe(`addSection`, () => {
  let next: Analyzer;
  let propertyDbId: string;
  let unitId: string;
  let propertyEntry: DbEntry;
  let totalInvestment: number;
  let cashFlowMonthly: number;
  let numStart: number;
  let priceNumber = 500000;
  let sqftNumber = 10000;
  let targetRentNumber = 5000;
  let simpleProps: ["property", "propertyGeneral"];
  let entryProps: [...typeof simpleProps, { dbEntry: DbEntry }];

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
              sqft: dbNumObj(sqftNumber),
            },
          },
        ],
        unit: [
          {
            dbId: unitId,
            childDbIds: {},
            dbVarbs: {
              targetRentMonthly: dbNumObj(targetRentNumber),
            },
          },
        ],
      },
    };
    simpleProps = ["property", "propertyGeneral"];
    entryProps = [...simpleProps, { dbEntry: propertyEntry }];
    totalInvestment = next
      .section("final")
      .value("totalInvestment", "numObj").numberStrict;
    cashFlowMonthly = next
      .section("final")
      .value("cashFlowMonthly", "numObj").numberStrict;
    numStart = next.sectionArr("property").length;
  });
  it("should have one more section", () => {
    next = next.addSectionAndSolve(...simpleProps);
    expect(next.sectionArr("property").length).toBe(numStart + 1);
  });
  it("should have its dbEntry dbId", () => {
    next = next.addSectionAndSolve(...entryProps);
    const property = next.lastSection("property");
    expect(property.dbId === propertyDbId);
  });
  it("should have its dbEntry values", () => {
    next = next.addSectionAndSolve(...entryProps);
    const property = next.lastSection("property");
    expect(property.value("price", "numObj").number).toBe(priceNumber);
    expect(property.value("sqft", "numObj").number).toBe(sqftNumber);
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
    expect(nextTotalInvestment).toBe(totalInvestment + priceNumber);
    expect(nextCashFlowMonthly).toBe(cashFlowMonthly + targetRentNumber);
  });
});
