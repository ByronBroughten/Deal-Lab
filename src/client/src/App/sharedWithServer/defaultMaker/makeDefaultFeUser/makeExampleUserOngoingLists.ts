import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import {
  makeExampleSingleTimeList,
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
  // feStore.loadChild({
  //   childName: "ongoingListMain",
  //   sectionPack: makeCapExList(exampleUserCapExProps, "exampleCapX1"),
  // });
  return feStore.makeChildPackArr("ongoingListMain");
}

export function makeExampleUserSingleTimeLists() {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.loadChild({
    childName: "singleTimeListMain",
    sectionPack: makeExampleSingleTimeList(
      "Misc upfront cost examples",
      userRepairVarbProps
    ),
  });
  return feStore.makeChildPackArr("singleTimeListMain");
}
