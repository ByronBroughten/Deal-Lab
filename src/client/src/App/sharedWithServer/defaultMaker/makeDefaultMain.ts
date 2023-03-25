import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPage } from "./makeDefaultDealPage";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("mainDealMenu");
  main.addChild("variablesMenu");
  main.loadChild({
    childName: "activeDealPage",
    sectionPack: makeDefaultDealPage(),
  });

  const feStore = main.loadAndGetChild({
    childName: "feStore",
    sectionPack: makeDefaultFeUserPack(),
  });

  const varbEditor = main.addAndGetChild("userVarbEditor");
  varbEditor.replaceChildArrs(feStore.makeChildPackArrs("numVarbListMain"));

  const listEditor = main.addAndGetChild("userListEditor");
  listEditor.replaceChildArrs(
    feStore.makeChildPackArrs("singleTimeListMain", "ongoingListMain")
  );

  const latentSections = main.addAndGetChild("latentSections");
  latentSections.loadChild({
    childName: "dealPage",
    sectionPack: makeDefaultDealPage(),
  });

  return main.makeSectionPack();
}
