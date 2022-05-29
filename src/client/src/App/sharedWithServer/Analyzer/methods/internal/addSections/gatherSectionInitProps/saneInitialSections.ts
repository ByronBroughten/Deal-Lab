import { cloneDeep } from "lodash";
import { initOutputListDefault } from "./saneInitialSections/initOutputListDefault";

const core = {
  outputListDefault: initOutputListDefault,
} as const;

type Core = typeof core;

class SaneInitialSections {
  protected core = {
    outputListDefault: initOutputListDefault,
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
