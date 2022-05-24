import { FeSections } from "../SectionsState/SectionsState";

export type SharedSections = { sections: FeSections };

export type HasSharedSections = {
  shared: SharedSections;
};

export class HasSharedSectionsProp {
  constructor(readonly shared: SharedSections) {}
  get sections() {
    return this.shared.sections;
  }
}
