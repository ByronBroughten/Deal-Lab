import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { SetterTesterVarb } from "./TestUtils/SetterTesterVarb";

describe("SetterVarb", () => {
  const namesAndValues = [
    ["propertyFocal", ["displayName", stringObj("New Title")]],
    ["propertyFocal", ["price", numObj(250000)]],
    ["unit", ["rent"]],
  ] as const;
  it("should directly update the value", () => {
    const tester = SetterTesterVarb.init({
      pathName: "propertyFocal",
      varbName: "displayName",
    });
    const nextValue = stringObj("New Title");
    tester.setter.updateValue(nextValue);
    expect(tester.get.value()).toEqual(nextValue);
  });
  it("should update and solve for the value", () => {
    const tester = SetterTesterVarb.init({
      pathName: "propertyFocal",
      varbName: "price",
    });
    const preNum = tester.get.numberOrZero;

    const getDealAnscestor = () =>
      tester.get.nearestAnscestor({
        sectionName: "deal",
        varbName: "totalInvestment",
      });

    const preFinal = getDealAnscestor();
    const preFinalNum = preFinal.numberOrZero;

    const amountToAdd = 10000;
    const nextValue = numObj(preNum + amountToAdd);
    tester.setter.updateValue(nextValue);

    const postNum = tester.get.numberOrQuestionMark;
    const postFinal = getDealAnscestor();
    const postFinalNum = postFinal.numberOrZero;

    expect(postNum).toBe(preNum + amountToAdd);
    expect(postFinalNum).toBe(preFinalNum + amountToAdd);
  });

  // function pgInEntity(varbName: string, offset: number) {
  //   return analyzer.newInEntity("propertyGeneral", varbName, offset);
  // }

  // export function newInEntity(
  //   this: Analyzer,
  //   finder: SectionFinder,
  //   varbName: string,
  //   offset: number
  // ) {
  //   const entityName = this.displayNameVn(varbName, finder);
  //   return [
  //     entityName,
  //     entityS.inEntity(
  //       {
  //         id: "static",
  //         infoType: "relative",
  //         sectionName: "propertyGeneral",
  //         varbName: varbName,
  //       },
  //       {
  //         offset,
  //         length: entityName.length,
  //       }
  //     ),
  //   ] as const;
  // }

  // it("should add outEntities for new inEntities", () => {
  //   const [entity1Name, entity1] = pgInEntity("sqft", 0);
  //   const [entity2Name, entity2] = pgInEntity("price", entity1Name.length + 1);

  //   const mainText = `${entity1Name}+${entity2Name}`;
  //   let numObj = new NumObj({ mainText, entities: [entity1, entity2] });

  //   let next = exec("homeInsYearly", numObj);
  //   next.feVarb("homeInsYearly", propertyInfo);

  //   const homeInsYearlyInfo = FeInfoS.feVarb("homeInsYearly", propertyInfo);
  //   const propertyGeneral = next.section("propertyGeneral");

  //   const outEntity1 = propertyGeneral.varb("sqft").outEntities[0];
  //   const outEntity2 = propertyGeneral.varb("price").outEntities[0];

  //   expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));
  //   expect(outEntity2).toEqual(entityS.outEntity(homeInsYearlyInfo, entity2));
  // });
  // it("should remove outEntities when inEntities are removed", () => {
  //   const varbName1 = "sqft";
  //   const varbName2 = "price";
  //   const [entity1Name, entity1] = pgInEntity(varbName1, 0);
  //   const [entity2Name, entity2] = pgInEntity(
  //     varbName2,
  //     entity1Name.length + 1
  //   );

  //   let mainText = `${entity1Name}+${entity2Name}`;
  //   let numObj = new NumObj({ mainText, entities: [entity1, entity2] });
  //   analyzer = exec("homeInsYearly", numObj);

  //   mainText = `${mainText}+`;
  //   numObj = new NumObj({
  //     mainText: mainText,
  //     entities: [entity1],
  //   });

  //   analyzer = exec("homeInsYearly", numObj);
  //   const homeInsYearlyInfo = FeInfoS.feVarb("homeInsYearly", propertyInfo);
  //   const propertyGeneral = analyzer.section("propertyGeneral");

  //   const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
  //   expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));

  //   const outEntities2 = propertyGeneral.varb(varbName2).outEntities;
  //   expect(outEntities2.length).toBe(0);
  // });
  // it("should add outEntities for two subsequent updates", () => {
  //   const varbName1 = "sqft";
  //   const [entity1Name, entity1] = pgInEntity(varbName1, 0);
  //   let mainText = `${entity1Name}+`;
  //   let numObj = new NumObj({
  //     mainText,
  //     entities: [entity1],
  //   });

  //   analyzer = exec("homeInsYearly", numObj);

  //   const varbName2 = "price";
  //   const [entity2Name, entity2] = pgInEntity(
  //     varbName2,
  //     entity1Name.length + 1
  //   );

  //   mainText = `${mainText}${entity2Name}`;
  //   numObj = new NumObj({
  //     mainText: mainText,
  //     entities: [entity1, entity2],
  //   });

  //   analyzer = exec("homeInsYearly", numObj);

  //   const homeInsYearlyInfo = FeInfoS.feVarb("homeInsYearly", propertyInfo);
  //   const propertyGeneral = analyzer.section("propertyGeneral");

  //   const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
  //   const outEntity2 = propertyGeneral.varb(varbName2).outEntities[0];

  //   expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));
  //   expect(outEntity2).toEqual(entityS.outEntity(homeInsYearlyInfo, entity2));
  // });
});

// makeChangeHandler, updateValue, loadValueFromVarb
// createEditor
