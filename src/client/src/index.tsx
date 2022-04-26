import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

reportWebVitals();

// Revamp tables
// 3.1 move all the tableName stuff to sectionMetas
// the tables have their rowSource
// the rowSources need their tables
// implement that in sectionMeta

// 3.2 make sectionMetas assign tableName to
// each of the rowSources (null to the rest)
// Use a type to enforce this in sectionMetas
// For this, you will need to create a type that shows null
// for every section except for the rowSources
// 3.3 make a "rowIndexSection" category that takes the index
// sections and extracts the ones that are rowSources (I guess)
// 4. Fix the functions involved in the Table component
// Make them deal just with the table rows rather than index entries
// 5. Make make the row index entries lookup use the tables instead
// of indexSections
// 5.5 Make the rowIndexSections in baseSections and relSections be copies of
// what they save.
// 6. Make it so that every time a rowIndexSection is saved,
// it creates a row on the frontEnd and also saves a table
// For this, you will need to create a new route that basically combines.
// a sectionArr and section query
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
