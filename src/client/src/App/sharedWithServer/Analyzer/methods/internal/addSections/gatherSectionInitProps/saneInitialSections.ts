import { cloneDeep } from "lodash";
import { initMgmtDefault } from "./saneInitialSections/initMgmtDefault";
import { initOutputListDefault } from "./saneInitialSections/initOutputListDefault";
import { initPropertyDefault } from "./saneInitialSections/initPropertyDefault";

const core = {
  outputListDefault: initOutputListDefault,
  propertyDefault: initPropertyDefault,
  mgmtDefault: initMgmtDefault,
} as const;

type Core = typeof core;

class SaneInitialSections {
  protected core = {
    outputListDefault: initOutputListDefault,
    propertyDefault: initPropertyDefault,
    mgmtDefault: initMgmtDefault,
  } as const;
  constructor() {}
  isIn(sectionName: any): sectionName is keyof Core {
    return sectionName in this.core;
  }
  get(sectionName: keyof Core) {
    return cloneDeep(this.core[sectionName]);
  }
}

export const saneInitialSections = new SaneInitialSections();
