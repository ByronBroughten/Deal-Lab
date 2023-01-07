import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    dbVarbs: {
      basePayUnitSwitch: "percent",
      basePayDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      expensesOngoingSwitch: "monthly",
    },
  });

  return mgmt.makeSectionPack();
}
