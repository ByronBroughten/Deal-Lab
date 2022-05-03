import { cloneDeep } from "lodash";
import { initLoanDefault } from "./saneInitialSections/initLoanDefault";
import { initMgmtDefault } from "./saneInitialSections/initMgmtDefault";
import { initOutputListDefault } from "./saneInitialSections/initOutputListDefault";
import { initPropertyDefault } from "./saneInitialSections/initPropertyDefault";

const core = {
  outputListDefault: initOutputListDefault,
  propertyDefault: initPropertyDefault,
  loanDefault: initLoanDefault,
  mgmtDefault: initMgmtDefault,
} as const;

// right now, this is how
// the columns are being initialize.

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
