import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import {
  makeExampleOneTimeList,
  makeUtilityList,
} from "./makeExampleOngoingLists";
import {
  exampleUserUtilityProps,
  userRepairVarbProps,
} from "./makeExampleOngoingListsProps";

export function makeExampleUserOngoingLists(): SectionPack<"periodicList">[] {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.addChild("ongoingListMain", {
    sectionPack: makeUtilityList(exampleUserUtilityProps, "exampleUtil1"),
  });
  return feStore.makeChildPackArr("ongoingListMain");
}

export function makeExampleUserOneTimeLists() {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.addChild("onetimeListMain", {
    sectionPack: makeExampleOneTimeList(
      "Misc upfront cost examples",
      userRepairVarbProps
    ),
  });
  return feStore.makeChildPackArr("onetimeListMain");
}
