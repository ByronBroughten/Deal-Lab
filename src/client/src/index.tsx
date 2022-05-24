import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

reportWebVitals();
// add and test editor update and solve
// implement a bigStringEditor update (property title)
// implement a numObj update in a basicInfo (property price)
// implement units in property, for the sake of adding one, with the new numObj update
// implement outputList
// implement remove unit

// Integrate the new core and handlers
// 1. Convert all the parentInfos of both analyzer and sections so they can swap states

// 2. Is there a way to use one state for one section of the app and use the other state
// for the other section?
// I can do that. But they won't be able to solve based on the stuff from analyzer.
// That might be ok for the time being.

// Alright. It's time to try substituting the new state for a portion of the app.
// Try using it for mgmtGeneral and its children, and outputLists, and see if the
// upfrontInvestment updates as it should

// first, add the replacement for mgmtGeneral

// Redo the tableColumns route

// Get rid of defaultSections and defaultStore.
// Get rid of different kinds of SectionPack
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
