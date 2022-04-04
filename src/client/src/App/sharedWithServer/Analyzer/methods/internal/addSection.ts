import { AddSectionProps } from "./addSections/addSectionsTypes";

export function addSection(props: AddSectionProps) {
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
