import { StrictOmit } from "../../utils/types";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function analysisSection<
  SN extends "analysis" | "analysisIndexNext",
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
    rowIndexName: "analysisIndexNext",
    arrStoreName: "analysis",
  } as const),
  ...analysisSection("analysisIndexNext"),
  ...relSection.base("both", "output", "Output", rel.varbs.varbInfo()),
} as const;
