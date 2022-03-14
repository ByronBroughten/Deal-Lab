import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { FeInfo, Inf } from "../SectionMetas/Info";
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
            homeInsYearly: dbNumObj(values.homeInsYearly),
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

function makePropertyGeneralEntity(varbName: string, entityName: string) {
  return {
    entityId: Analyzer.makeId(),
    id: "static",
    idType: "relative",
    sectionName: "propertyGeneral",
    varbName: varbName,
    offset: 0,
    length: entityName.length,
  } as const;
}

describe("Analyzer.updateValues", () => {
  let analyzer: Analyzer;
  let propertyInfo: FeInfo;

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
        targetRent: 5000,
      }),
    });
    propertyInfo = analyzer.lastSection("property").feInfo;
    const generalPropertyInfo = analyzer.section("propertyGeneral").feInfo;

    entity1Name = analyzer.displayName(Inf.feVarb("sqft", generalPropertyInfo));
    entity1 = makePropertyGeneralEntity("sqft", entity1Name);
    entity2Name = analyzer.displayName(
      Inf.feVarb("price", generalPropertyInfo)
    );
    entity2 = makePropertyGeneralEntity("price", entity2Name);
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
    let editorText = "500";
    let numObj = new NumObj({ editorText, entities: [] });
    let next = exec("homeInsYearly", numObj);
    expect(
      next.feValue("homeInsYearly", propertyInfo, "numObj").editorText
    ).toBe(editorText);
  });

  // it("should update the value for NumObj types", () => {
  //   let nextValue = 500;
  //   let numObj = new NumObj({ editorText: `${nextValue}`, entities: [] });
  //   let next = exec("homeInsYearly", numObj);
  //   expect(next.feValue("homeInsYearly", propertyInfo, "numObj").number).toBe(
  //     nextValue
  //   );
  // });

  // it("should update the value for NumObj types with entitites", () => {})
});
