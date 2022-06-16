import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Write Tests
// - the rest of sectionSetter and varbSetter tests
// - the actor tests

// update the query tests:
// - addSection
// extract tests from fe
// - loadSectionPack, directUpdateAndSolve

// For loading deals, start with straightforward loading
// Just load the deal such that its values update.

// To make it possible to query the properties of property, loan, mgmt
// for columns, add variables to those, like "propertyUserVarbs", or whatever
// Just add those—no need to fuck with em quite yet. Or call it,
// "localUserVarbs", or something. Yeah, call it the same thing for all of em.

// Implement paying for Pro
// Upload to Heroku
// Make a video demo/ad
// Get loading entire deals to work-just implement straightforward, variable-update loading
// Make the mainSectionLoadMenu use GenericAutoComplete

// UI
// What about auto-save? Autosave would be really cool to have
//instead of "Save Updates". It would make it more intuitive
// Then I wouldn't need "Save New" or "Save Update". I would
// just need "Make Copy" and "Save". Save would just initialize
// the auto-saving.
// That's kind of the only way to make the component-aspects of this
// make sense.

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

// Hide the save menus behind a click, then label their buttons.
// Always have "Save New"; also have "Save Updates", "Make Copy", "Saved Plural"
// Allow interest only payments on loans
// Allow ongoing income on property, or a list of "other income" on each unit
// Load deal:
// grab the deal from where it's saved
// load it into sectionPack builder
// check whether its property, loans, and mgmt are saved
// if they are, load them from the db and replace them
// in the deal.
// send the updated deal sectionPack and load it up

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
