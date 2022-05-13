import { SectionPackRaw } from "../../../../SectionPackRaw";
import { defaultProperty } from "./saneInitialSections/initPropertyDefaultNext";

type DefaultSectionName = "property";
type Defaults = {
  [SN in DefaultSectionName]: SectionPackRaw<SN>;
};

class DefaultSectionPacks {
  private defaults: Defaults = {
    property: defaultProperty,
  };
  constructor() {}
  has(sectionName: any): sectionName is DefaultSectionName {
    return sectionName in this.defaults;
  }
  get<DN extends DefaultSectionName>(sectionName: DN): SectionPackRaw<DN> {
    return this.defaults[sectionName] as any as SectionPackRaw<DN>;
  }
}

export const defaultSectionPacks = new DefaultSectionPacks();
