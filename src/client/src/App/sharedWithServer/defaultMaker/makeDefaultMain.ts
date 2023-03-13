import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPage } from "./makeDefaultDealPage";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { defaultDealOutputInfos } from "./makeDefaultOutputList";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  const feUser = main.loadAndGetChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });

  main.loadChild({
    childName: "activeDealPage",
    sectionPack: makeDefaultDealPage(),
  });

  const varbEditor = main.addAndGetChild("userVarbEditor");
  varbEditor.replaceChildArrs(feUser.makeChildPackArrs("numVarbListMain"));

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
  latentSections.loadChild({
    childName: "dealPage",
    sectionPack: makeDefaultDealPage(),
  });

  return main.makeSectionPack();
}
