import Analyzer from "../../Analyzer";
import { DbEntry } from "../DbEntry";
import { FeInfo } from "../SectionMetas/Info";
import { DbNumObj } from "../SectionMetas/relSections/rel/valueMeta/NumObj";

type UnitProps = {
  dbId?: string;
  values?: {
    targetRentMonthly?: DbNumObj;
  };
};

function dbProperty({
  property = {},
  unit1 = {},
  unit2 = {},
}: {
  property?: {
    dbId?: string;
    values?: {
      price?: DbNumObj;
      sqft?: DbNumObj;
      homeInsYearly?: DbNumObj;
    };
  };
  unit1?: UnitProps;
  unit2?: UnitProps;
} = {}): DbEntry {
  const propertyDbId = property.dbId ?? Analyzer.makeId();
  const unit1DbId = unit1.dbId ?? Analyzer.makeId();
  const unit2DbId = unit2.dbId ?? Analyzer.makeId();
  return {
    dbId: propertyDbId,
    dbSections: {
      property: [
        {
          dbId: propertyDbId,
          childDbIds: {
            unit: [unit1DbId, unit2DbId],
          },
          dbVarbs: {
            ...property.values,
          },
        },
      ],
      unit: [
        {
          dbId: unit1DbId,
          childDbIds: {},
          dbVarbs: {
            ...unit1.values,
          },
        },
        {
          dbId: unit2DbId,
          childDbIds: {},
          dbVarbs: {
            ...unit2.values,
          },
        },
      ],
    },
  };
}

// remember to change SpecificVarbInfo so that it only accepts
// fe or static info
describe("Analyzer.eraseSectionAndSolve", () => {
  let next: Analyzer;
  let props: NonNullable<Parameters<typeof dbProperty>[0]>;
  let propertyInfo: FeInfo;

  beforeEach(() => {
    next = Analyzer.initAnalyzer();

    props = {
      property: {
        dbId: Analyzer.makeId(),
      },
      unit1: {
        dbId: Analyzer.makeId(),
      },
      unit2: {
        dbId: Analyzer.makeId(),
      },
    };

    next = next.addSectionAndSolve("property", "propertyGeneral", {
      dbEntry: dbProperty(props),
    });
    propertyInfo = next.lastSection("property").feInfo;
  });

  // describe("section removal", () => {

  // })

  const exec = () => next.eraseSectionAndSolve(propertyInfo);

  it("should remove one section", () => {
    const initLength = next.sectionArr("property").length;
    next = exec();
    expect(next.sectionArr("property").length).toBe(initLength - 1);
    expect(next.findSection(propertyInfo)).toBeUndefined();
    const property = next.findSectionByDbId(
      "property",
      props.property?.dbId as string
    );
    expect(property).toBeUndefined();
  });
  it("should remove that section's children", () => {
    const initLength = next.sectionArr("unit").length;
    next = exec();
    expect(next.sectionArr("unit").length).toBe(initLength - 2);
    const unit1 = next.findSectionByDbId("unit", props.unit1?.dbId as string);
    const unit2 = next.findSectionByDbId("unit", props.unit2?.dbId as string);
    expect(unit1).toBeUndefined();
    expect(unit2).toBeUndefined();
  });
  // it("should remove outEntityIds for section and children inEntityIds removed", () => {

  // });
  // it("should solve", () => {

  // });
});
