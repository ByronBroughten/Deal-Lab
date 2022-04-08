import { AddSectionProps } from "./addSections/addSectionsTypes";

// sectionName: SN;
// parentFinder: ParentFinder<SN>;
// feId?: string;
// childFeIds?: OneChildIdArrs<SN, "fe">;
// dbId?: string;
// dbVarbs?: DbVarbs;
// idx?: number;

export function addSectionDefault(props: AddSectionProps) {
  const addSectionsProps: AddSectionProps[] = [];
  addSectionsProps.push(props);

  // For now I will check for makeOneOnStartup in the children
  // And I will default to using the defaultSections
  // when they are available.

  // I created a sectionPack
  // it's pretty much empty
  // The section being added shouldn't be empty, though.
  // some children should be initialized whenever
  // their parent is.
  // ok, so addSection checks whether there is a default sectionPack
  // if there is, it uses that.
  // if not, it just makes a blank one
  // hows that sound?
  // I should at least initialize the children that are "alwaysOne"
  // right?
}
