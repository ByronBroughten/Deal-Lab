import { RelVarbs } from "./rel/relVarbs";
import { rel } from "./rel";
import { relSection } from "./rel/relSection";
import { SectionContext } from "./baseSections";

const analysisRelVarbs: RelVarbs<SectionContext, "analysis"> = {
  title: rel.varb.string(),
} as const;

export const relAnalysisStuff = {
  ...relSection.base(
    "fe" as SectionContext,
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
    "fe" as SectionContext,
    "analysisDefault",
    "Analysis",
    { ...analysisRelVarbs },
    {
      parent: "main",
      makeOneOnStartup: true,
      childSectionNames: ["output"] as const,
    }
  ),
  ...relSection.base(
    "fe" as SectionContext,
    "output",
    "Output",
    rel.varbs.varbInfo(),
    {
      parent: "analysis",
    }
  ),
  ...rel.section.managerTable(
    "analysisTable",
    "Analysis Table",
    "analysisIndex"
  ),
} as const;
