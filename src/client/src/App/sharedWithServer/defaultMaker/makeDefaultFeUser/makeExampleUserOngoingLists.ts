import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import {
  makeCapExList,
  makeExampleSingleTimeList,
  makeUtilityList,
} from "./makeExampleOngoingLists";
import {
  exampleUserCapExProps,
  exampleUserUtilityProps,
  userRepairVarbProps,
} from "./makeExampleOngoingListsProps";

export function makeExampleUserOngoingLists(): SectionPack<"ongoingList">[] {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  feUser.loadChild({
    childName: "ongoingListMain",
    sectionPack: makeUtilityList(exampleUserUtilityProps, "exampleUtil1"),
  });
  feUser.loadChild({
    childName: "ongoingListMain",
    sectionPack: makeCapExList(exampleUserCapExProps, "exampleCapX1"),
  });
  return feUser.makeChildPackArr("ongoingListMain");
}

export function makeExampleUserSingleTimeLists() {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  feUser.loadChild({
    childName: "singleTimeListMain",
    sectionPack: makeExampleSingleTimeList(
      "Misc upfront cost examples",
      userRepairVarbProps
    ),
  });
  return feUser.makeChildPackArr("singleTimeListMain");
}
