import { DbEnt } from "../../../../../DbEntry";
import { initOutputs } from "./initAnalysisDefault";

const columnIds = ["NYCfQJkWIZKI", "J8Sqg91929O5", "p9xNvEd7UpuS"] as const;

const initColumns = initOutputs.map((output, i) => ({
  dbId: columnIds[i],
  values: output.values,
}));

export const initAnalysisTable = DbEnt.makeTableEntry(
  "analysisTable",
  "kmmjsyJZN4hx",
  initColumns
);
