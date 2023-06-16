import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { getDealModes } from "../SectionsMeta/values/StateValue/dealMode";
import { inEntityValueInfo } from "../SectionsMeta/values/StateValue/InEntityValue";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { defaultOutputInfos } from "./makeDefaultOutputList";
import { outputListName } from "./makeDefaultOutputSection";

export function makeDefaultDealCompareMenu(): SectionPack<"dealCompareMainMenu"> {
  const menu = PackBuilderSection.initAsOmniChild("dealCompareMainMenu");

  for (const dealMode of getDealModes("plusMixed")) {
    const listName = outputListName(dealMode);
    const outputList = menu.addAndGetChild(listName);
    const infos = defaultOutputInfos(dealMode);
    for (const info of infos) {
      outputList.addChild("outputItem", {
        sectionValues: {
          valueEntityInfo: inEntityValueInfo(info),
        },
      });
    }
  }

  return menu.makeSectionPack();
}
