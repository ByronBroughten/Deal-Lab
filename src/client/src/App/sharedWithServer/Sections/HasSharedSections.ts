import { FeSections } from "../SectionsState/SectionsState";

export type SharedSections = { sections: FeSections };

export class HasSharedSections {
  constructor(readonly shared: SharedSections) {}
}
