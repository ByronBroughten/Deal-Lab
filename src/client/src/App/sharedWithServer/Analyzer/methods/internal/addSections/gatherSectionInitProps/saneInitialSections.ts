import { cloneDeep } from "lodash";
import { makeSectionId } from "../../../../../makeSectionId";
import { DbEnt } from "../../../../DbEntry";

import { initAnalysisDefault } from "./saneInitialSections/initAnalysisDefault";
import { initAnalysisTable } from "./saneInitialSections/initAnalysisTable";
import { initLoanDefault } from "./saneInitialSections/initLoanDefault";
import { initMgmtDefault } from "./saneInitialSections/initMgmtDefault";
import { initPropertyDefault } from "./saneInitialSections/initPropertyDefault";

const core = {
  analysisDefault: initAnalysisDefault,
  propertyDefault: initPropertyDefault,
  loanDefault: initLoanDefault,
  mgmtDefault: initMgmtDefault,

  analysisTable: initAnalysisTable,
  propertyTable: DbEnt.makeTableEntry("propertyTable", makeSectionId()),
  loanTable: DbEnt.makeTableEntry("loanTable", makeSectionId()),
  mgmtTable: DbEnt.makeTableEntry("mgmtTable", makeSectionId()),
} as const;

type Core = typeof core;

class SaneInitialSections {
  protected core = core;
  constructor() {}
  isIn(sectionName: any): sectionName is keyof Core {
    return sectionName in this.core;
  }
  get(sectionName: keyof Core) {
    return cloneDeep(this.core[sectionName]);
  }
}

export const saneInitialSections = new SaneInitialSections();
