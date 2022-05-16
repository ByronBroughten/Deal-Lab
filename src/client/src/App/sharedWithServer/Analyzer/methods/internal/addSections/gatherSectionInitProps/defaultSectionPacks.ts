import { SectionName } from "../../../../../SectionsMeta/SectionName";
import { SectionPackRaw } from "../../../../SectionPackRaw";
import { makeDefaultPropertyPack } from "./saneInitialSections/initPropertyDefaultNext";

type FunctionsMakeDefault<SN extends SectionName> = {
  [S in SN]: () => SectionPackRaw<S>;
};
class DefaultSectionPackMaker<SN extends SectionName> {
  constructor(private makeDefaults: FunctionsMakeDefault<SN>) {}
  has(sectionName: any): sectionName is SN {
    return sectionName in this.makeDefaults;
  }
  make(sectionName: SN): SectionPackRaw<SN> {
    return this.makeDefaults[sectionName]() as any as SectionPackRaw<SN>;
  }
}

export const defaultMaker = new DefaultSectionPackMaker({
  property: makeDefaultPropertyPack,
});
