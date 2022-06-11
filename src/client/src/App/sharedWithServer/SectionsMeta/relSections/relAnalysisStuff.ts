import { StrictOmit } from "../../utils/types";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function analysisSection<
  SN extends "analysis" | "analysisIndex",
  O extends StrictOmit<
    RelSectionOptions<"fe", "analysis">,
    "childNames" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    "both",
    sectionName,
    "Analysis",
    { title: rel.varb.string() } as RelVarbs<"fe" | "db", SN>,
    {
      ...((options ?? {}) as O),
      childNames: [
        "propertyGeneral",
        "financing",
        "mgmtGeneral",
        "totalInsAndOuts",
        "final",
        "dealOutputList",
        "dealVarbList",
      ] as const,
    }
  );
}

export const relAnalysisStuff = {
  ...analysisSection("analysis", {
    rowIndexName: "analysisIndex",
    arrStoreName: "analysis",
  } as const),
  ...analysisSection("analysisIndex"),
  ...relSection.base("both", "output", "Output", rel.varbs.varbInfo()),
} as const;
