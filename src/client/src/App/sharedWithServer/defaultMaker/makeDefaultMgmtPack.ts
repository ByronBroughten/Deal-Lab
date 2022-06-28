import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    dbVarbs: {
      rentCutUnitSwitch: "percent",
      rentCutDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      ongoingExpensesOngoingSwitch: "monthly",
    },
  });
  return mgmt.makeSectionPack();
}
