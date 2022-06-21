import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPackRaw<"mgmt"> {
  const main = PackBuilderSection.initAsMain();
  const mgmt = main.addAndGetDescendant(["deal", "mgmtGeneral", "mgmt"], {
    dbVarbs: {
      rentCutUnitSwitch: "percent",
      rentCutDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      ongoingExpensesOngoingSwitch: "monthly",
    },
  });
  return mgmt.makeSectionPack();
}
