import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { FeInfo, Inf } from "../SectionMetas/Info";
import { switchNames } from "../SectionMetas/relSections/baseSections/switchNames";
import {
  dbNumObj,
  NumObj,
} from "../SectionMetas/relSections/rel/valueMeta/NumObj";
import { InEntity } from "../SectionMetas/relSections/rel/valueMeta/NumObj/entities";
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

  let entity1: InEntity;
  let entity1Name: string;
  let entity2: InEntity;
  let entity2Name: string;

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

    entity1Name = analyzer.displayName(Inf.feVarb("sqft", propertyGeneralInfo));
    entity2Name = analyzer.displayName(
      Inf.feVarb("price", propertyGeneralInfo)
    );
  });

  const exec = (varbName: string, nextValue: StateValue) =>
    analyzer.directUpdateAndSolve(
      Inf.feVarb(varbName, propertyInfo),
      nextValue
    );
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
  it("should add out entities for new inEntities", () => {
    const editorText = `${entity1Name}+${entity2Name}`;
    entity1 = propertyGeneralEntity("sqft", entity1Name, 0);
    entity2 = propertyGeneralEntity(
      "price",
      entity2Name,
      entity1Name.length + 1
    );
    let numObj = new NumObj({ editorText, entities: [entity1, entity2] });
    let next = exec("homeInsYearly", numObj);

    expect(next.feVarb("sqft", propertyGeneralInfo).outEntities.length).toBe(1);
    expect(next.feVarb("price", propertyGeneralInfo).outEntities.length).toBe(
      1
    );
  });
});
