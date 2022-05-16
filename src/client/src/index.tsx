import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

reportWebVitals();

// 2. Make NewOrDefaultChildAdder
// ...For this you may need to create default sections on the fly
// 3. Make SectionBuilder (a FocalSection)
// 4. Work on EntitiesSections and SectionSolver

// to Integrate the new Sections, you will need a solver.

// Try building a default sectionPack with AddsSections and makesSections

// Integrate the new core and handlers
// Option 1.
// Edit analyzer
// I would have to make FeSections be the state
// And I would have to make Analyzer take FeSections
// as an argument that can produce its core.
// Except that whenever there is a set state, analyzer must produce
// its core.

// Option 2.
// Make a state adjacent to Analyzer
// Add new state handlers

// Ok. In order to use this to create the defaults.
// I need to be able to initialize its core.
// and it needs to produce a sectionPack

// Redo the tableColumns route

// Revamp defaults
// 1. Make the FeSections be able to initialize an empty
// section whose only children are "alwaysOne"
// 2. Make it able to produce rawSectionPacks
// 3. Try using it to create default sectionPacks
// including perhaps one default analyzer sectionPack (which lacks a loan)
// 4. Hook the new sectionAdder up to the main

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
