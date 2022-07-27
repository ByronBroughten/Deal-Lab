import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Properties menu
// List the properties

// rename "user" section to "userInfo"
// same with serverUser

// tailor which dbSections can be accessed by which
// routes. You don't want subscriptions to be editable
// by the section functions, ect.

// List the properties
// You can use the same dropdown, or you can use Autocomplete

// You will probably want Autocomplete. You want to be able
// to search for the properties.

// Load Deal with updated property, loan, mgmt
// - for each child of loaded section, check whether there is a mainStore
//   If there is, check whether any of the dbIds match
//   If they do, load em
//   Do this for all descendants, in order

// - Disable "Compare Deals" button unless user is pro
// - Hide Compare Deals table unless user is pro

// - Disable saving when there are more than two properties, unless
//   user is pro (front end)

// - Disable saving when there are more than two properties, unless
//   user is pro (back end)

// All I need for now:

// "reset to default"
// "load"
// "save new" (when not saved, saves with current dbId)

// "make a copy" (when saved, adds "copy" to title, saves)
// "copy and save" (when saved; new dbId, adds "copy" to title, saves)
// "save updates"(when saved, saves with current dbId)
// "delete" (when saved, makes it no longer saved)

// I will need the menu to be in the top right, in a separate block
// Will the menu push things to the right when it opens?
// I suppose so.
// Save menu

// it can be like gmail and google keep's menu

// sectionPack variable names?

// Core Features
// * Load "property" with updates
// * Load  "deal" with updates
// be able to select outputs as variables for the table.
// * Implement payments!

// Write Tests
// - the rest of sectionSetter and varbSetter tests
// - the actor tests
// - tests to verify the calculations

// Implement paying for Pro
// Make the mainSectionLoadMenu use GenericAutoComplete
// Upload to Heroku
// Make a video demo/ad

// Hide the save menus behind a click; label their buttons.
// Always have "Save New"; also have "Save Updates", "Make Copy", "Saved Plural"

// - Make a function for gathering props in SolveValueVarb(?)

reportWebVitals();
