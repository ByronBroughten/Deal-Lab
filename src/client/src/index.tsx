import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// get tests to pass
// replace getUserSectionsById
// replace findSectionPack

// implement the new way of loading from the db.

// get rid of all duplicate sectionNames (for the lists, etc)
// - you will need to add sections to differentiate the
// - ones with the same names

// when do I implement the new way of loading from the db?

// ok. the plan is to only load "main"
// is this a bad idea for any reason?
// oh. I must load parents before children

// make main db savable
// get the main sectionPack from the db (there should only be one).
// make a sectionPackBuilder
// for each child in main, if it is a dbStoreName
// add its dbInfo (plus feId) to an array
// use the dbInfos to try to get all of them from the db
// go through the array with the children, and if the dbInfo was found
// load it
// I can probably query all the children of each section at a time, at least;
// I'll try doing individual queries first, though.

// for all the dbSections that are found,
//  use omniParent to make a sectionPack loader to replace each section that has the same dbInfo
// make that sectionPack and send it

// get rid of indexName

// write the load code that checks the db for children with the same
// dbId to update

// - think about implementing rel parent such that the sectionName is negotiable

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
