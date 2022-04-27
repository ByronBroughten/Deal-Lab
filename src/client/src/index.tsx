import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

reportWebVitals();

// 4. Fix the functions involved in the Table component
// Make them deal just with the table rows rather than index entries

// addRowIndexSection
// create the new tableRow on the frontEnd
// add indexSection update sourceTable
// deleteRowIndexSection
// delete indexSection update sourceTable
// updateRowIndexSection
// update indexSection update sourceTable

// 5. Make make the row index entries lookup that use the tables instead
// of indexSections
// 5.5 Make the rowIndexSections in baseSections and relSections be copies of
// what they save.

// 7. Test everything out, I guess!

// Fix user
// 1. Remove the db-only variables from user.
// 2. Tack on a custom section to DbUser and MongooseUser
// called "serverOnlyUser", with encrypted password, etc
// This won't every be queried directly by the client

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
