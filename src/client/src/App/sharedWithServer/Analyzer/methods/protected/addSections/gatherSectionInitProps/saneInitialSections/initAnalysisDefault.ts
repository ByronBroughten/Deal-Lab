import { DbEnt } from "../../../../../DbEntry";
import { Inf } from "../../../../../SectionMetas/Info";

export const initOutputs = [
  {
    dbId: "cQymV2Bkt0iZ",
    values: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "totalInvestment",
    },
  },
  {
    dbId: "f6XSAyPzjFhR",
    values: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "cashFlowYearly",
    },
  },
  {
    dbId: "FOleBYyjtcW6",
    values: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "roiYearly",
    },
  },
] as const;

const initEntry = DbEnt.initEntry(
  "analysisDefault",
  { title: "" },
  { dbId: "_8k6-iypEf84" }
);

export const initAnalysisDefault = DbEnt.addLikeChildren(
  initEntry,
  initOutputs.map((output) => DbEnt.initSection(output.dbId, output.values)),
  "output",
  Inf.db("analysisDefault", initEntry.dbId)
);
