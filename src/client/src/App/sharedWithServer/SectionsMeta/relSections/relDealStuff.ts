import { StrictOmit } from "../../utils/types";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function dealSection<
  SN extends "deal",
  O extends StrictOmit<
    RelSectionOptions<"fe", "deal">,
    "childNames" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    "both",
    sectionName,
    "Analysis",
    rel.varbs.savableSection as RelVarbs<"fe" | "db", SN>,
    {
      ...((options ?? {}) as O),
      childNames: [
        "propertyGeneral",
        "financing",
        "mgmtGeneral",
        "totalInsAndOuts",
        "final",
        "dealOutputList",
        "internalVarbList",
      ] as const,
    }
  );
}

export const relDealStuff = {
  ...dealSection("deal", {
    rowIndexName: "deal",
    arrStoreName: "deal",
  } as const),
  ...relSection.base("both", "output", "Output", rel.varbs.varbInfo()),
} as const;
