import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

reportWebVitals();

// Fix user
// - Change the SectionPack stuff so that there is no sectionContext/contextName
// - Make a ServerSectionPack whose only difference is that it has serverOnlyUser
// - Make ServerSectionPack only appear on the serverSide
// - Make DbSectionPack based on that
// - Add the serverOnlyUser to the server side of things
// - Change the createUser functions to do it the right way
// - Change the current user to not have the protected stuff
// - Clean up messes

// Make the login and register tests pass.
// 1. For login, make it save an indexEntry before
// logging in, to test that thoroughly

// Complete the sectionAdder
// 1. Make it add a section whereby it uses all default
// values and adds only children that are "alwaysOne"
// 2. Add the sectionPack loader functionality
// 3. Make it able initEmpty or initSectionPack
// For this, there are a couple options. You may have it init empty
// And then require replacing a section with a sectionPack
// You probably don't want to be able to add multiples of the top section
// No, I don't think you do.

// replace Analyzer's core with sectionAdder

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
