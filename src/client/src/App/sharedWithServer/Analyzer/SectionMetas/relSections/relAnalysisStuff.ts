import { RelVarbs } from "./rel/relVarbs";
import { rel } from "./rel";
import { relSection } from "./rel/relSection";

const analysisRelVarbs: RelVarbs<"analysis"> = {
  title: rel.varb.string(),
} as const;

export const relAnalysisStuff = {
  ...relSection.base(
    "analysis",
    "Analysis",
    { ...analysisRelVarbs },
    {
      parent: "main",
      makeOneOnStartup: true,
      childSectionNames: ["output"] as const,
      indexStoreName: "analysisIndex",
      defaultStoreName: "analysisDefault",
    }
  ),
  ...relSection.rowIndex("analysisIndex", "Analysis Index"),
  ...relSection.base(
    "analysisDefault",
    "Analysis",
    { ...analysisRelVarbs },
    {
      parent: "main",
      makeOneOnStartup: true,
      childSectionNames: ["output"] as const,
    }
  ),
  ...relSection.base("output", "Output", rel.varbs.varbInfo(), {
    parent: "analysis",
  }),
  ...rel.section.managerTable(
    "analysisTable",
    "Analysis Table",
    "analysisIndex"
  ),
} as const;
