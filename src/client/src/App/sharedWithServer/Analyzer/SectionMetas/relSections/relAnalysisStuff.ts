import { RelVarbs } from "./rel/relVarbs";
import { rel } from "./rel";
import { relSection } from "./rel/relSection";
import { ContextName } from "./baseSections";

const analysisRelVarbs: RelVarbs<ContextName, "analysis"> = {
  title: rel.varb.string(),
} as const;

export const relAnalysisStuff = {
  ...relSection.base(
    "both",
    "analysis",
    "Analysis",
    { ...analysisRelVarbs },
    {
      makeOneOnStartup: true,
      childSectionNames: ["output"] as const,
      indexStoreName: "analysisIndex",
      defaultStoreName: "analysisDefault",
    }
  ),
  ...relSection.rowIndex("analysisIndex", "Analysis Index"),
  ...relSection.base(
    "both",
    "analysisDefault",
    "Analysis",
    { ...analysisRelVarbs },
    {
      makeOneOnStartup: true,
      childSectionNames: ["output"] as const,
    }
  ),
  ...relSection.base("both", "output", "Output", rel.varbs.varbInfo()),
  ...rel.section.managerTable(
    "analysisTable",
    "Analysis Table",
    "analysisIndex"
  ),
} as const;
