import { rel } from "./rel";
import { relSection } from "./rel/relSection";

// table will just have rows.
export const relAnalysisStuff = {
  ...relSection.rowIndex("analysisIndex", "Analysis Index"),
  ...relSection.base("both", "output", "Output", rel.varbs.varbInfo()),
  ...rel.section.managerTable(
    "analysisTable",
    "Analysis Table",
    "analysisIndex"
  ),
} as const;
