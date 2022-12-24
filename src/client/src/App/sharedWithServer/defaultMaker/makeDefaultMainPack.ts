import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  const defaultDealPack = makeDefaultDealPack();
  main.loadChild({
    childName: "activeDeal",
    sectionPack: defaultDealPack,
  });

  const latentSections = main.addAndGetChild("latentSections");
  latentSections.loadChild({
    childName: "deal",
    sectionPack: defaultDealPack,
  });

  const feUser = main.loadAndGetChild({
    childName: "feUser",
    sectionPack: makeDefaultFeUserPack(),
  });

  const varbEditor = main.addAndGetChild("userVarbEditor");
  varbEditor.loadChildren({
    childName: "userVarbList",
    sectionPacks: feUser.makeChildPackArr("userVarbListMain"),
  });

  const listEditor = main.addAndGetChild("userListEditor");
  listEditor.replaceChildArrs({
    ongoingList: feUser.makeChildPackArr("ongoingListMain"),
    singleTimeList: feUser.makeChildPackArr("singleTimeListMain"),
  });

  return main.makeSectionPack();
}
