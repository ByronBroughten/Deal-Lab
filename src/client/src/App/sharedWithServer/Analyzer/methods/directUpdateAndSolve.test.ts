import { pick } from "lodash";
import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { FeInfo, Inf } from "../SectionMetas/Info";
import { switchNames } from "../SectionMetas/relSections/baseSections/switchNames";
import {
  dbNumObj,
  NumObj,
} from "../SectionMetas/relSections/rel/valueMeta/NumObj";
import {
  Ent,
  InEntity,
} from "../SectionMetas/relSections/rel/valueMeta/NumObj/entities";
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

function propertyGeneralEntity(
  varbName: string,
  entityName: string,
  offset: number
) {
  return {
    entityId: Analyzer.makeId(),
    id: "static",
    idType: "relative",
    sectionName: "propertyGeneral",
    varbName: varbName,
    offset: offset,
    length: entityName.length,
  } as const;
}

describe("Analyzer.updateValues", () => {
  let analyzer: Analyzer;
  let propertyInfo: FeInfo;
  let propertyGeneralInfo: FeInfo;

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
    propertyGeneralInfo = analyzer.section("propertyGeneral").feInfo;
  });

  const exec = (
    varbName: string,
    nextValue: StateValue,
    next: Analyzer = analyzer
  ) => next.directUpdateAndSolve(Inf.feVarb(varbName, propertyInfo), nextValue);

  function propertyGeneralEntity(varbName: string, offset: number) {
    const entityName = analyzer.displayName(
      Inf.feVarb(varbName, propertyGeneralInfo)
    );
    return [
      entityName,
      {
        entityId: Analyzer.makeId(),
        id: "static",
        idType: "relative",
        sectionName: "propertyGeneral",
        varbName: varbName,
        offset: offset,
        length: entityName.length,
      },
    ] as const;
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
    const [entity1Name, entity1] = propertyGeneralEntity("sqft", 0);
    const [entity2Name, entity2] = propertyGeneralEntity(
      "price",
      entity1Name.length + 1
    );

    const editorText = `${entity1Name}+${entity2Name}`;
    let numObj = new NumObj({ editorText, entities: [entity1, entity2] });

    let next = exec("homeInsYearly", numObj);
    next.feVarb("homeInsYearly", propertyInfo);

    const homeInsYearlyInfo = Inf.feVarb("homeInsYearly", propertyInfo);
    const propertyGeneral = next.section("propertyGeneral");

    const outEntity1 = propertyGeneral.varb("sqft").outEntities[0];
    const outEntity2 = propertyGeneral.varb("price").outEntities[0];

    expect(outEntity1).toEqual(Ent.outEntity(homeInsYearlyInfo, entity1));
    expect(outEntity2).toEqual(Ent.outEntity(homeInsYearlyInfo, entity2));
  });
  it("should add outEntities for two subsequent updates", () => {
    const varbName1 = "sqft";
    const [entity1Name, entity1] = propertyGeneralEntity(varbName1, 0);
    let editorText = `${entity1Name}+`;
    let numObj = new NumObj({
      editorText,
      entities: [entity1],
    });

    let next = exec("homeInsYearly", numObj);

    const varbName2 = "price";
    const [entity2Name, entity2] = propertyGeneralEntity(
      varbName2,
      entity1Name.length + 1
    );

    editorText = `${editorText}${entity2Name}`;
    numObj = new NumObj({
      editorText: editorText,
      entities: [entity1, entity2],
    });

    next = exec("homeInsYearly", numObj, next);

    const homeInsYearlyInfo = Inf.feVarb("homeInsYearly", propertyInfo);
    const propertyGeneral = next.section("propertyGeneral");

    const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
    const outEntity2 = propertyGeneral.varb(varbName2).outEntities[0];

    expect(outEntity1).toEqual(Ent.outEntity(homeInsYearlyInfo, entity1));
    expect(outEntity2).toEqual(Ent.outEntity(homeInsYearlyInfo, entity2));
  });
});
