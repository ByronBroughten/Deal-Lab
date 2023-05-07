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

export function makeExampleUserOngoingLists(): SectionPack<"ongoingList">[] {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.loadChild({
    childName: "ongoingListMain",
    sectionPack: makeUtilityList(exampleUserUtilityProps, "exampleUtil1"),
  });
  return feStore.makeChildPackArr("ongoingListMain");
}

export function makeExampleUserOneTimeLists() {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.loadChild({
    childName: "onetimeListMain",
    sectionPack: makeExampleOneTimeList(
      "Misc upfront cost examples",
      userRepairVarbProps
    ),
  });
  return feStore.makeChildPackArr("onetimeListMain");
}
