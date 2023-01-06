import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("calculatedVarbs");

  const defaultDealPack = makeDefaultDealPack();
  main.loadChild({
    childName: "activeDeal",
    sectionPack: defaultDealPack,
  });

  const latentSections = main.addAndGetChild("latentSections");
  latentSections.addChild("calculatedVarbs");
  latentSections.loadChild({
    childName: "deal",
    sectionPack: defaultDealPack,
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
