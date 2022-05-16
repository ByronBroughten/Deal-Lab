import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { sectionNameS } from "../SectionsMeta/SectionName";
import { SectionList } from "./SectionList";

export type SectionsStateCore = {
  readonly [SN in SimpleSectionName]: SectionList<SN>;
};

export class FeSections {
  constructor(readonly core: SectionsStateCore) {}
  static initCore(): SectionsStateCore {
    return sectionNameS.arrs.all.reduce((core, sectionName) => {
      core[sectionName] = new SectionList({
        sectionName,
        list: [],
      }) as any;
      return core;
    }, {} as { -readonly [SN in keyof SectionsStateCore]: SectionsStateCore[SN] });
  }
  static init() {
    return new FeSections(FeSections.initCore());
  }
}
// this is nice.
