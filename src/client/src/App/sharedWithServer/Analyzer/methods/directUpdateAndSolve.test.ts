import Analyzer from "../../Analyzer";
import { entityS } from "../../SectionMetas/baseSections/baseValues/entities";
import {
  dbNumObj,
  NumObj,
} from "../../SectionMetas/baseSections/baseValues/NumObj";
import { switchNames } from "../../SectionMetas/baseSections/switchNames";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import { DbEntry } from "../DbEntry";
import { StateValue } from "../StateSection/StateVarb/stateValue";

function makePropertyEntry(values: {
  homeInsYearly: number;
  sqft: number;
  title: string;
  targetRent: number;
}): DbEntry {
  const homeIns = switchNames("homeIns", "ongoing");

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
            sqft: dbNumObj(values.sqft),
            [homeIns.yearly]: dbNumObj(values.homeInsYearly),
            [homeIns.switch]: "yearly",
            title: values.title,
          },
        },
      ],
      unit: [
        {
          dbId: unitId,
          childDbIds: {},
          dbVarbs: {
            targetRentMonthly: dbNumObj(values.targetRent),
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
        homeInsYearly: 1000,
        sqft: 1000,
        title: "Original title",
        targetRent: 6000,
      }),
    });
    propertyInfo = analyzer.lastSection("property").feInfo;
  });

  const exec = (varbName: string, nextValue: StateValue) =>
    analyzer.directUpdateAndSolve(
      Inf.feVarb(varbName, propertyInfo),
      nextValue
    );

  function pgInEntity(varbName: string, offset: number) {
    return analyzer.newInEntity("propertyGeneral", varbName, offset);
  }

  it("should update the value for basic types (string, number, ect)", () => {
    let next = exec("title", "Next title");
    expect(next.feValue("title", propertyInfo)).toBe("Next title");
  });
  it("should update the value for NumObj types", () => {
    let editorText = "600";
    let numObj = new NumObj({ editorText, entities: [] });
    let next = exec("homeInsYearly", numObj);
    expect(
      next.feValue("homeInsYearly", propertyInfo, "numObj").editorText
    ).toBe(editorText);
  });
  it("should solve the attached values of the solved value", () => {
    let num = 600;
    let editorText = `${num}`;
    let numObj = new NumObj({ editorText, entities: [] });
    let next = exec("homeInsYearly", numObj);

    const nextMonthly = num / 12;
    const homeInsMonthly = next.feValue(
      "homeInsMonthly",
      propertyInfo,
      "numObj"
    );
    expect(homeInsMonthly.number).toBe(nextMonthly);
    expect(homeInsMonthly.editorText).toBe(`${nextMonthly}`);
  });
  it("should add outEntities for new inEntities", () => {
    const [entity1Name, entity1] = pgInEntity("sqft", 0);
    const [entity2Name, entity2] = pgInEntity("price", entity1Name.length + 1);

    const editorText = `${entity1Name}+${entity2Name}`;
    let numObj = new NumObj({ editorText, entities: [entity1, entity2] });

    let next = exec("homeInsYearly", numObj);
    next.feVarb("homeInsYearly", propertyInfo);

    const homeInsYearlyInfo = Inf.feVarb("homeInsYearly", propertyInfo);
    const propertyGeneral = next.section("propertyGeneral");

    const outEntity1 = propertyGeneral.varb("sqft").outEntities[0];
    const outEntity2 = propertyGeneral.varb("price").outEntities[0];

    expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));
    expect(outEntity2).toEqual(entityS.outEntity(homeInsYearlyInfo, entity2));
  });
  it("should remove outEntities when inEntitites are removed", () => {
    const varbName1 = "sqft";
    const varbName2 = "price";
    const [entity1Name, entity1] = pgInEntity(varbName1, 0);
    const [entity2Name, entity2] = pgInEntity(
      varbName2,
      entity1Name.length + 1
    );

    let editorText = `${entity1Name}+${entity2Name}`;
    let numObj = new NumObj({ editorText, entities: [entity1, entity2] });
    analyzer = exec("homeInsYearly", numObj);

    editorText = `${editorText}+`;
    numObj = new NumObj({
      editorText: editorText,
      entities: [entity1],
    });

    analyzer = exec("homeInsYearly", numObj);
    const homeInsYearlyInfo = Inf.feVarb("homeInsYearly", propertyInfo);
    const propertyGeneral = analyzer.section("propertyGeneral");

    const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
    expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));

    const outEntities2 = propertyGeneral.varb(varbName2).outEntities;
    expect(outEntities2.length).toBe(0);
  });
  it("should add outEntities for two subsequent updates", () => {
    const varbName1 = "sqft";
    const [entity1Name, entity1] = pgInEntity(varbName1, 0);
    let editorText = `${entity1Name}+`;
    let numObj = new NumObj({
      editorText,
      entities: [entity1],
    });

    analyzer = exec("homeInsYearly", numObj);

    const varbName2 = "price";
    const [entity2Name, entity2] = pgInEntity(
      varbName2,
      entity1Name.length + 1
    );

    editorText = `${editorText}${entity2Name}`;
    numObj = new NumObj({
      editorText: editorText,
      entities: [entity1, entity2],
    });

    analyzer = exec("homeInsYearly", numObj);

    const homeInsYearlyInfo = Inf.feVarb("homeInsYearly", propertyInfo);
    const propertyGeneral = analyzer.section("propertyGeneral");

    const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
    const outEntity2 = propertyGeneral.varb(varbName2).outEntities[0];

    expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));
    expect(outEntity2).toEqual(entityS.outEntity(homeInsYearlyInfo, entity2));
  });
});
