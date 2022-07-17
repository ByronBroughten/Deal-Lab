import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Sections I need to get right before release (savable sections):
// dbStore*
// singleTimeList*
// ongoingList*
// singleTimeItem*
// ongoingItem - double-check

// outputList*
// output - rename to outputItem

// property*
// unit - is it ok that "one" is a numObj?
// loan*
// mgmt
// deal

// user
// serverOnlyUser

// - Make an entityString valueType, and use it for virtualVarbs that can load
//   their values from other virtual varbs.
// - Make a function for gathering props in SolveValueVarb
// - Settle on final names for sections in general.

// when variables give their displayName, displayNameEnd, etc, I can check
// if it's a virtualVarbValue, and if so, access those in a different way.

// make output work like loadedVarbs, so that it actually harbors the value
// of its varb. It also harbors the varb's displayName, too, and its inEntityInfo.
// its displayName also comes from its

// The point of virtual varbs is the ability to select them in varb selectors.
// I want to be able to select those output values as variables without saving
// the user variables from which they're derived.

// Core Features
// * Load  "deal" with updates and be able to select
// outputs as variables.

// * Load "property" with updates
// * Load "singleTimeList", etc, with updates
// * Implement payments!

// Write Tests
// - the rest of sectionSetter and varbSetter tests
// - the actor tests

// To make sure the userVarbs come from the right place:
// When implementing userVarbs, make them draw from feStore userVarbList
// those may be the only ones.

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
