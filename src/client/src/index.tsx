import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// Ok. This thing is almost ready. Once I reimplement the new state
// all throughout the app, and then finalize the ability for people to pay

// I can focus on a few UI and theme things
// and then it's ready to sell.
// I know that technically, it would still benefit from a few
// other things:

// UI
// What about auto-save? Autosave would be really cool to have
//instead of "Save Updates". It would make it more intuitive
// Then I wouldn't need "Save New" or "Save Update". I would
// just need "Make Copy" and "Save". Save would just initialize
// the auto-saving.
// That's kind of the only way to make the component-aspects of this
// make sense. Otherwise, if someone loads a list, for instance, edits
// the list but doesn't save it, and then loads the property again, that
// list won't be updated, or it will be, but it'll feel like a bug.
// I want a way to sync up the properties and deals and whatnot.

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
// implement outputList
// implement the rest of property
// completely remove analyzer and replace it with sections

// Redo the tableColumns route

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
