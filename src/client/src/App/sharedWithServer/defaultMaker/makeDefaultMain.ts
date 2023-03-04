import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { defaultDealOutputInfos } from "./makeDefaultOutputList";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  const feUser = main.loadAndGetChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });

  const dealPage = main.addAndGetChild("activeDealPage");
  dealPage.addChild("calculatedVarbs");
  dealPage.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  const varbEditor = main.addAndGetChild("userVarbEditor");
  varbEditor.replaceChildArrs(feUser.makeChildPackArrs("userVarbListMain"));

  const listEditor = main.addAndGetChild("userListEditor");
  listEditor.replaceChildArrs(
    feUser.makeChildPackArrs("singleTimeListMain", "ongoingListMain")
  );

  const dealCompare = main.addAndGetChild("dealCompare");
  defaultDealOutputInfos.forEach((outputInfo) => {
    const compareValue = dealCompare.addAndGetChild("compareValue");
    compareValue.updateValues({
      valueEntityInfo: inEntityValueInfo(outputInfo),
    });
  });

  main.addChild("variablesMenu");

  const latentSections = main.addAndGetChild("latentSections");
  latentSections.addChild("calculatedVarbs");
  latentSections.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  return main.makeSectionPack();
}
