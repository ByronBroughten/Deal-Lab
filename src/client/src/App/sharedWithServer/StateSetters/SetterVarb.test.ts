import { NumObj } from "../SectionsMeta/baseSections/baseValues/NumObj";
import { SetterTesterVarb } from "./TestUtils/SetterTesterVarb";

describe("SetterVarb", () => {
  const namesAndValues = [
    ["property", ["title", "New Title"]],
    ["property", ["price", NumObj.init(250000)]],
    ["unit", ["rent"]],
  ] as const;

  it("should directly update the value", () => {
    const tester = SetterTesterVarb.init({
      sectionName: "property",
      varbName: "title",
    });
    const nextValue = "New Title";
    tester.setter.updateValueDirectly(nextValue);
    expect(tester.get.value()).toBe(nextValue);
  });
  it("should update and solve for the value", () => {
    const tester = SetterTesterVarb.init({
      sectionName: "property",
      varbName: "price",
    });

    const preNum = tester.get.value("numObj").numberOrZero;

    const preFinal = tester.get.sections
      .oneAndOnly("deal")
      .varb("totalInvestment");
    const preFinalNum = preFinal.value("numObj").numberOrZero;

    const amountToAdd = 10000;
    const nextValue = NumObj.init(preNum + amountToAdd);
    tester.setter.updateValueDirectly(nextValue);

    const postNum = tester.get.value("numObj").number;
    const postFinal = tester.get.sections
      .oneAndOnly("deal")
      .varb("totalInvestment");
    const postFinalNum = postFinal.value("numObj").numberOrZero;

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
  //         idType: "relative",
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

  //   const editorText = `${entity1Name}+${entity2Name}`;
  //   let numObj = new NumObj({ editorText, entities: [entity1, entity2] });

  //   let next = exec("homeInsYearly", numObj);
  //   next.feVarb("homeInsYearly", propertyInfo);

  //   const homeInsYearlyInfo = InfoS.feVarb("homeInsYearly", propertyInfo);
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

  //   let editorText = `${entity1Name}+${entity2Name}`;
  //   let numObj = new NumObj({ editorText, entities: [entity1, entity2] });
  //   analyzer = exec("homeInsYearly", numObj);

  //   editorText = `${editorText}+`;
  //   numObj = new NumObj({
  //     editorText: editorText,
  //     entities: [entity1],
  //   });

  //   analyzer = exec("homeInsYearly", numObj);
  //   const homeInsYearlyInfo = InfoS.feVarb("homeInsYearly", propertyInfo);
  //   const propertyGeneral = analyzer.section("propertyGeneral");

  //   const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
  //   expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));

  //   const outEntities2 = propertyGeneral.varb(varbName2).outEntities;
  //   expect(outEntities2.length).toBe(0);
  // });
  // it("should add outEntities for two subsequent updates", () => {
  //   const varbName1 = "sqft";
  //   const [entity1Name, entity1] = pgInEntity(varbName1, 0);
  //   let editorText = `${entity1Name}+`;
  //   let numObj = new NumObj({
  //     editorText,
  //     entities: [entity1],
  //   });

  //   analyzer = exec("homeInsYearly", numObj);

  //   const varbName2 = "price";
  //   const [entity2Name, entity2] = pgInEntity(
  //     varbName2,
  //     entity1Name.length + 1
  //   );

  //   editorText = `${editorText}${entity2Name}`;
  //   numObj = new NumObj({
  //     editorText: editorText,
  //     entities: [entity1, entity2],
  //   });

  //   analyzer = exec("homeInsYearly", numObj);

  //   const homeInsYearlyInfo = InfoS.feVarb("homeInsYearly", propertyInfo);
  //   const propertyGeneral = analyzer.section("propertyGeneral");

  //   const outEntity1 = propertyGeneral.varb(varbName1).outEntities[0];
  //   const outEntity2 = propertyGeneral.varb(varbName2).outEntities[0];

  //   expect(outEntity1).toEqual(entityS.outEntity(homeInsYearlyInfo, entity1));
  //   expect(outEntity2).toEqual(entityS.outEntity(homeInsYearlyInfo, entity2));
  // });
});

// makeChangeHandler, updateValueDirectly, loadValueFromVarb
// updateValueFromEditor, createEditor
