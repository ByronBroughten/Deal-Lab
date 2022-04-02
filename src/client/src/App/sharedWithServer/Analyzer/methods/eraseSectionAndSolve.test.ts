import Analyzer from "../../Analyzer";
import { FeInfo } from "../SectionMetas/Info";
import { DbNumObj } from "../SectionMetas/relSections/baseSections/baseValues/NumObj";
import { InEntity } from "../SectionMetas/relSections/baseSections/baseValues/NumObj/entities";
import { DbEntry } from "../DbEntry";

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

type Props = NonNullable<Parameters<typeof dbProperty>[0]>;

// remember to change SpecificVarbInfo so that it only accepts
// fe or static info
describe("Analyzer.eraseSectionAndSolve", () => {
  let next: Analyzer;
  let props: Props;
  let sectionEraseInfo: FeInfo;

  beforeEach(() => {
    next = Analyzer.initAnalyzer();
  });

  const exec = () => next.eraseSectionAndSolve(sectionEraseInfo);

  describe("section removal", () => {
    beforeEach(() => {
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
      sectionEraseInfo = next.lastSection("property").feInfo;
    });
    it("should remove one section", () => {
      const initLength = next.sectionArr("property").length;
      next = exec();
      expect(next.sectionArr("property").length).toBe(initLength - 1);
      expect(next.findSection(sectionEraseInfo)).toBeUndefined();
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
  });
  describe("outEntityRemoval", () => {
    let props1: Props;
    let props2: Props;
    let excemptInEntity: InEntity;

    function pgInEntity(varbName: string, offset: number) {
      return next.newInEntity("propertyGeneral", varbName, offset);
    }

    beforeEach(() => {
      const [entityName1, entity1] = pgInEntity("price", 0);
      const [entityName2, entity2] = pgInEntity("sqft", entityName1.length + 1);
      const [entityName3, entity3] = pgInEntity("price", 0);

      let excemptEntityName: string;
      [excemptEntityName, excemptInEntity] = pgInEntity("price", 0);

      props1 = {
        property: {
          dbId: Analyzer.makeId(),
          values: {
            homeInsYearly: {
              editorText: `${entityName1}+${entityName2}`,
              entities: [entity1, entity2],
            },
          },
        },
        unit1: {
          values: {
            targetRentMonthly: {
              editorText: `${entityName3}`,
              entities: [entity3],
            },
          },
        },
        unit2: {},
      };
      props2 = {
        property: {
          dbId: Analyzer.makeId(),
          values: {
            homeInsYearly: {
              editorText: `${excemptEntityName}`,
              entities: [excemptInEntity],
            },
          },
        },
      };
      next = next.addSectionAndSolve("property", "propertyGeneral", {
        dbEntry: dbProperty(props1),
      });
      next = next.addSectionAndSolve("property", "propertyGeneral", {
        dbEntry: dbProperty(props2),
      });

      sectionEraseInfo = next.findSectionByDbId(
        "property",
        props1.property?.dbId as string
      )?.feInfo as FeInfo;
    });

    it("should remove outEntityIds for all removed inEntityIds", () => {
      let propertyGeneral = next.section("propertyGeneral");
      const priceOutInit = propertyGeneral.varb("price").outEntities.length;
      const sqftOutInit = propertyGeneral.varb("sqft").outEntities.length;
      next = exec();
      propertyGeneral = next.section("propertyGeneral");
      const priceOutEntities = propertyGeneral.varb("price").outEntities;
      const priceOutNext = priceOutEntities.length;
      const sqftOutNext = propertyGeneral.varb("sqft").outEntities.length;

      expect(priceOutNext).toBe(priceOutInit - 2);
      expect(sqftOutNext).toBe(sqftOutInit - 1);
      expect(priceOutEntities[0].entityId).toBe(excemptInEntity.entityId);
    });
  });

  // it("should solve", () => {

  // });
});
