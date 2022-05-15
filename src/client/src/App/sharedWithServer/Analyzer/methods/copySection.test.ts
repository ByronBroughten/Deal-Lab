import Analyzer from "../../Analyzer";
import { dbNumObj } from "../../SectionsMeta/baseSections/baseValues/NumObj";
import { FeInfo } from "../../SectionsMeta/Info";
import { DbEntry } from "../DbEntry";

function makePropertyEntry(
  propertyId: string,
  unitId: string,
  propertyValues: {
    price: number;
    title: string;
    targetRentMonthly: number;
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
            title: propertyValues.title,
          },
        },
      ],
      unit: [
        {
          dbId: unitId,
          childDbIds: {},
          dbVarbs: {
            targetRentMonthly: dbNumObj(propertyValues.targetRentMonthly),
          },
        },
      ],
    },
  };
}

describe("Analyzer.copySection", () => {
  const propertyValues = {
    title: "Original Title",
    price: 500000,
    targetRentMonthly: 5000,
  } as const;

  let propertyDbId: string;
  let unitId: string;
  let next: Analyzer;
  let propertyInfo: FeInfo;
  let numPropertiesInitial: number;

  beforeEach(() => {
    propertyDbId = Analyzer.makeId();
    unitId = Analyzer.makeId();
    next = Analyzer.initAnalyzer();
    next = next.addSectionAndSolve("property", "propertyGeneral", {
      dbEntry: makePropertyEntry(propertyDbId, unitId, propertyValues),
    });
    propertyInfo = next.lastSection("property").feInfo;
    numPropertiesInitial = next.sectionArr("property").length;
  });

  const exec = () => next.copySection(propertyInfo);
  it("should produce the same number of entries as before copying", () => {
    next = exec();
    expect(next.sectionArr("property").length).toBe(numPropertiesInitial);
  });
  it("should produce a section with the same feId as the section being copied", () => {
    next = exec();
    const nextFeId = next.lastSection("property").feId;
    expect(nextFeId).toBe(propertyInfo.id);
  });
  it("should produce a section with a different dbId than the section being copied", () => {
    next = exec();
    const nextDbId = next.lastSection("property").dbId;
    expect(nextDbId).not.toBe(propertyDbId);
  });
  it("should produce a section with a title that is the original title + ' copy'", () => {
    next = exec();
    const nextTitle = next.lastSection("property").value("title", "string");
    expect(nextTitle).toBe(propertyValues.title + " copy");
  });
  it("should produce a section that has the same values as the one being copied, aside from title", () => {
    next = exec();
    const nextValues = next.lastSection("property").values({
      price: "numObj",
      targetRentMonthly: "numObj",
    });

    expect(nextValues.price.number).toBe(propertyValues.price);
    expect(nextValues.targetRentMonthly.number).toBe(
      propertyValues.targetRentMonthly
    );
  });
  it("should produce a section with children that have different dbIds than before", () => {
    next = exec();
    expect(next.lastSection("unit").dbId).not.toBe(unitId);
  });
});
