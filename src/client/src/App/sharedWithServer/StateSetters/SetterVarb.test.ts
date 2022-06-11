import { NumObj } from "../SectionsMeta/baseSections/baseValues/NumObj";
import { VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SetterVarb } from "./SetterVarb";
import { SetterTester } from "./TestUtils/SetSectionsTester";

describe("SetterVarb", () => {
  let tester: SetterTester;
  beforeEach(() => {
    tester = new SetterTester();
  });
  function setterFromState<SN extends SectionName>(
    varbInfo: VarbInfo<SN>
  ): SetterVarb<SN> {
    return new SetterVarb({
      ...varbInfo,
      ...tester.initSetterSectionsProps(),
    });
  }

  // should I have sectionsNames, and then varbNames plus values?

  const namesAndValues = [
    ["property", ["title", "New Title"]],
    ["property", ["price", NumObj.init(250000)]],
    ["unit", ["rent"]],
  ] as const;

  it("should directly update the value", () => {
    const varbInfo = tester.getLastVarbInfo({
      sectionName: "property",
      varbName: "title",
    });

    const nextValue = "New Title";
    const setter = setterFromState(varbInfo);
    setter.updateValueDirectly(nextValue);

    const varb = tester.getterVarbFromState(varbInfo);
    expect(varb.value()).toBe(nextValue);
  });
  it("should update and solve for the value", () => {
    const varbInfo = tester.getLastVarbInfo({
      sectionName: "property",
      varbName: "price",
    });
    const finalSolveInfo = tester.getLastVarbInfo({
      sectionName: "final",
      varbName: "totalInvestment",
    });

    const preVarb = tester.getterVarbFromState(varbInfo);
    const preNum = preVarb.value("numObj").numberOrZero;
    const preFinal = tester.getterVarbFromState(finalSolveInfo);
    const preFinalNum = preFinal.value("numObj").numberOrZero;

    const amountToAdd = 10000;
    const nextValue = NumObj.init(preNum + amountToAdd);

    const setter = setterFromState(varbInfo);
    setter.updateValueDirectly(nextValue);

    const postVarb = tester.getterVarbFromState(varbInfo);
    const postNum = postVarb.value("numObj").number;
    const postFinal = tester.getterVarbFromState(finalSolveInfo);
    const postFinalNum = postFinal.value("numObj").numberOrZero;

    expect(postNum).toBe(preNum + amountToAdd);
    expect(postFinalNum).toBe(preFinalNum + amountToAdd);
  });
});

// makeChangeHandler, updateValueDirectly, loadValueFromVarb
// updateValueFromEditor, createEditor
