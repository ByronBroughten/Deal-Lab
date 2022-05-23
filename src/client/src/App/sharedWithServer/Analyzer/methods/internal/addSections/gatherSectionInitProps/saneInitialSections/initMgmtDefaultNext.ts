import { SectionPackBuilder } from "../../../../../../SectionFocal/SectionPackBuilder";
import { SectionPackRaw } from "../../../../../SectionPackRaw";

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
