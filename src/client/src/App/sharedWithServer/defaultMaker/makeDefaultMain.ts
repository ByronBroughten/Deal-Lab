import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");
  const dealPage = main.addAndGetChild("activeDealPage");
  dealPage.addChild("calculatedVarbs");
  dealPage.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  const latentSections = main.addAndGetChild("latentSections");
  latentSections.addChild("calculatedVarbs");
  latentSections.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  const feUser = main.loadAndGetChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });

  const varbEditor = main.addAndGetChild("userVarbEditor");
  varbEditor.replaceChildArrs(feUser.makeChildPackArrs("userVarbListMain"));

  const listEditor = main.addAndGetChild("userListEditor");
  listEditor.replaceChildArrs(
    feUser.makeChildPackArrs("singleTimeListMain", "ongoingListMain")
  );

  return main.makeSectionPack();
}
