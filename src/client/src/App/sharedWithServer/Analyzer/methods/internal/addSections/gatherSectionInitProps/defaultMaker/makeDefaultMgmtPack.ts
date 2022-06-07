import { SectionPackRaw } from "../../../../../../SectionPack/SectionPackRaw";
import { SectionPackBuilder } from "../../../../../../StatePackers.ts/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPackRaw<"mgmt"> {
  const main = new SectionPackBuilder();
  const mgmt = main.addAndGetDescendant(["analysis", "mgmtGeneral", "mgmt"], {
    dbVarbs: {
      rentCutUnitSwitch: "percent",
      rentCutDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      ongoingExpensesOngoingSwitch: "monthly",
    },
  });
  return mgmt.makeSectionPack();
}
