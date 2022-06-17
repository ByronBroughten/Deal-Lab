import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// - let main have a parent ("omni parent"). Set off alarm bells when
//   a parent is accessed but the info is "no parent"
// - get rid of static sections
// -

// To make this system work as it should, I have to get rid of
// static sections, and I have to address the possibility of main
// having another main as a child (and thus having a parent, rather than
// just "no parent").

// to get rid of static sections, I would need to implement a new
// kind of rel sectionFinder. One that includes paths rather than sectionNames.
// I would probably have to put propertyGeneral and the like under "final"
// or under "totals ins and outs". I could combine those with final"

// Write Tests
// - the rest of sectionSetter and varbSetter tests
// - the actor tests

// Core Features
// * Load "main" with updates
// * Load  "deal" with updates
// * Load "property", etc, with updates
// * Load "singleTimeList", etc, with updates

// I'll need to make the list groups be sections
// I'll need to make propertyGeneral access the total
// of the appropriate list groups.

// loan would have two singleTime list groups, though.
// one would have to have a different sectionName than the other.

// there is a complication.
// if "property" has its own singleTimeList category
// and it has a list that has been saved
// each will have the same dbId
// as will the varbs.

// I ought to make a list of everything I want this to do
// for the core to be considered complete.
// And then try to figure out the best way to implement each item.

// 2. Load everything as it was saved (except entities will update)
//    There is no easy way to update the property, though.
// For loading deals
// 1. On the serverside
//   for each sectionName that the deal has which is also a storeName
//   check for the section by dbId
//   if it is found, replace the section with the saved version
//   send the updated deal to the client
// this is what I want. this makes the most sense.

// Upload to Heroku
// Implement paying for Pro
// Make the mainSectionLoadMenu use GenericAutoComplete
// Make a video demo/ad

// Implement interest only payments on loans

// Someone loads a property with a list that is saved
// the list's values are synced with the saved list
// the list items are edited on the property
// the property is saved
// the property is switched
// the property is switched back
// if the list's save takes precedent, the property's list remains unedited.
// That makes sense if the user is using those lists as intended, to sync
// up properties
// There should be a way to unteather the list from the saved ones
// I guess making a copy would be the way to go, then it's no longer saved.

// Hide the save menus behind a click; label their buttons.
// Always have "Save New"; also have "Save Updates", "Make Copy", "Saved Plural"
// Allow ongoing income on property, or a list of "other income" on each unit

reportWebVitals();
// implement rest of property
// mgmt
// loan

// Redo the tableColumns route, probably using sectionBuilder
// useSectionBuilder with a focal point of the table
// add rows to the table
// add cells to the row, each with a dbValue
// you'll need a way to index the sectionPack to get the values
// for the cells
// produce the table sectionPack and send it with the rest

// Get rid of defaultSections and defaultStore.
// Get rid of different kinds of SectionPack. You only need raw.
// Get rid of dbEntry

// private resetRowCells(rowFeId: string) {
// const feRowInfo = InfoS.fe("tableRow", rowFeId);
// let next = this.nextSections.eraseChildren(feRowInfo, "cell");
//   const columns = next.childSections(this.indexTableName, "column");
//   for (const column of columns) {
//     const varbInfo = column.varbInfoValues();
//     // Ok. Normally, I'll just use what the varbInfo says.
//     // But when the prop

//     const varbFinder =
//       varbInfo.sectionName === this.indexName
//         ? { ...varbInfo, sectionName: this.sectionName }
//         : varbInfo;
//     // I also need the source section's feId
//     // and this is only for this

//     const varb = next.findVarb(varbInfo);
//     const value = varb ? varb.value("numObj") : "Not Found";

//     next = next.addSectionsAndSolveNext([
//       {
//         sectionName: "cell",
//         parentFinder: feRowInfo,
//         dbVarbs: {
//           ...varbInfo,
//           value,
//         },
//       },
//     ]);
//   }
//   this.nextSections = next;
// }
