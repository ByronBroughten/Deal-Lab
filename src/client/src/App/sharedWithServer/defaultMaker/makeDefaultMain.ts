import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { defaultDealOutputInfos } from "./makeDefaultOutputList";

export function makeDefaultActiveDealSystem() {
  const dealSystem = PackBuilderSection.initAsOmniChild("dealSystem");
  dealSystem.addChild("calculatedVarbs");
  return dealSystem.makeSectionPack();
}

export function makeDefaultMain(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsOmniChild("main");

  main.addChild("mainDealMenu");
  main.addChild("variablesMenu");

  const latent = main.addAndGetChild("latentDealSystem");
  latent.addChild("calculatedVarbs");
  latent.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });

  const feStore = main.loadAndGetChild({
    childName: "feStore",
    sectionPack: makeDefaultFeUserPack(),
  });

  main.addChild("editorControls");
  const varbEditor = main.addAndGetChild("userVarbEditor");
  varbEditor.replaceChildArrs(feStore.makeChildPackArrs("numVarbListMain"));

  const listEditor = main.addAndGetChild("userListEditor");
  listEditor.replaceChildArrs(
    feStore.makeChildPackArrs("singleTimeListMain", "ongoingListMain")
  );

  const dealCompare = main.addAndGetChild("dealCompare");
  defaultDealOutputInfos.forEach((outputInfo) => {
    const compareValue = dealCompare.addAndGetChild("compareValue");
    compareValue.updateValues({
      valueEntityInfo: inEntityValueInfo(outputInfo),
    });
  });

  return main.makeSectionPack();
}
