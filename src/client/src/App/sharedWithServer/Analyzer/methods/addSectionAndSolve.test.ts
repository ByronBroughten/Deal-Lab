import Analyzer from "../../Analyzer";
import { entityS } from "../../SectionMetas/baseSections/baseValues/entities";
import {
  DbNumObj,
  dbNumObj,
} from "../../SectionMetas/baseSections/baseValues/NumObj";
import { DbEntry } from "../DbEntry";

function dbProperty({
  propertyDbId = Analyzer.makeId(),
  unitDbId = Analyzer.makeId(),
  propertyValues = {},
  unitValues = {},
}: {
  propertyDbId?: string;
  unitDbId?: string;
  propertyValues?: {
    price?: DbNumObj;
    sqft?: DbNumObj;
    homeInsYearly?: DbNumObj;
  };
  unitValues?: {
    targetRentMonthly?: DbNumObj;
  };
} = {}): DbEntry {
  return {
    dbId: propertyDbId,
    dbSections: {
      property: [
        {
          dbId: propertyDbId,
          childDbIds: {
            unit: [unitDbId],
          },
          dbVarbs: {
            ...propertyValues,
          },
        },
      ],
      unit: [
        {
          dbId: unitDbId,
          childDbIds: {},
          dbVarbs: {
            ...unitValues,
          },
        },
      ],
    },
  };
}

describe("Analyzer.addSectionAndSolve", () => {
  const simpleProps = ["property", "propertyGeneral"] as const;
  let numPropertiesInitial: number;
  let finalValues: {
    totalInvestment: number;
    cashFlowMonthly: number;
  };
  let next: Analyzer;
  let propertyDbId: string;
  let unitDbId: string;

  beforeEach(async () => {
    propertyDbId = Analyzer.makeId();
    unitDbId = Analyzer.makeId();
    next = Analyzer.initAnalyzer();

    numPropertiesInitial = next.sectionArr("property").length;
    finalValues = {
      totalInvestment: next.section("final").value("totalInvestment", "numObj")
        .numberStrict,
      cashFlowMonthly: next.section("final").value("cashFlowMonthly", "numObj")
        .numberStrict,
    };
  });

  describe("section changes", () => {
    it("should make one more section", () => {
      next = next.addSectionAndSolve(...simpleProps);
      expect(next.sectionArr("property").length).toBe(numPropertiesInitial + 1);
    });
    it("should make one child section", () => {
      next = next.addSectionAndSolve(...simpleProps);
      const property = next.lastSection("property");
      property.childFeIds("unit");
    });
    it("should make a section with the provided dbId", () => {
      next = next.addSectionAndSolve(...simpleProps);
      const property = next.lastSection("property");
      expect(property.dbId === propertyDbId);
    });
  });

  describe("value changes", () => {
    const propertyValues = {
      price: dbNumObj(500000),
      sqft: dbNumObj(10000),
    } as const;
    const unitValues = {
      targetRentMonthly: dbNumObj(5000),
    } as const;

    let entryProps: [...typeof simpleProps, { dbEntry: DbEntry }];

    beforeEach(async () => {
      entryProps = [
        ...simpleProps,
        {
          dbEntry: dbProperty({
            propertyDbId,
            unitDbId,
            propertyValues,
            unitValues,
          }),
        },
      ];
    });
    it("should have its dbEntry values", () => {
      next = next.addSectionAndSolve(...entryProps);
      const property = next.lastSection("property");
      expect(property.value("price", "numObj").editorText).toBe(
        propertyValues.price.editorText
      );
      expect(property.value("sqft", "numObj").editorText).toBe(
        propertyValues.sqft.editorText
      );
    });
    it("should solve all values", () => {
      next = next.addSectionAndSolve(...entryProps);
      const nextTotalInvestment = next
        .section("final")
        .value("totalInvestment", "numObj").number;
      const nextCashFlowMonthly = next
        .section("final")
        .value("cashFlowMonthly", "numObj").number;
      expect(nextTotalInvestment).toBe(
        finalValues.totalInvestment + parseInt(propertyValues.price.editorText)
      );
      expect(nextCashFlowMonthly).toBe(
        finalValues.cashFlowMonthly +
          parseInt(unitValues.targetRentMonthly.editorText)
      );
    });
  });
  describe("outEntityChanges", () => {
    function pgInEntity(varbName: string, offset: number) {
      return next.newInEntity("propertyGeneral", varbName, offset);
    }

    const varbName1 = "price";
    const varbName2 = "sqft";
    beforeEach(async () => {});

    it("should add outEntities for inEntities", () => {
      const [entityName1, entity1] = pgInEntity(varbName1, 0);
      const [entityName2, entity2] = pgInEntity(
        varbName2,
        entityName1.length + 1
      );

      next = next.addSectionAndSolve("property", "propertyGeneral", {
        dbEntry: dbProperty({
          propertyValues: {
            homeInsYearly: {
              editorText: `${entityName1}+${entityName2}`,
              entities: [entity1, entity2],
            },
          },
        }),
      });

      const homeInsYearlyInfo = next
        .lastSection("property")
        .varb("homeInsYearly").feVarbInfo;
      const propertyGeneral = next.section("propertyGeneral");
      const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
      const outEntity2 = propertyGeneral.varb(varbName2).outEntities[0];
      expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));
      expect(outEntity2).toEqual(entityS.outEntity(homeInsYearlyInfo, entity2));
    });
  });
});
