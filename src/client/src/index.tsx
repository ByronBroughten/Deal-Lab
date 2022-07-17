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
// ongoingItem* - Fine, except loadedVarb isn't working right (displayName, updates one step behind, etc)
// outputList*
// outputItem*
// property*

// unit - is it ok that "one" is a numObj? Yeah, it probably doesn't matter.
// it would be slightly more appropriate if I used a regular number
// and created an updateFn for such.

// loan*
// mgmt*
// deal*
// user*
// serverOnlyUser*

// - Make a function for gathering props in SolveValueVarb(?)

// - get loadedVarb to work right
// - make output work like loadedVarbs, so that it actually harbors the value
// of its varb. It also harbors the varb's displayName, too, and its inEntityInfo.
// its displayName also comes from its

// Core Features
// * Load  "deal" with updates
// be able to select outputs as variables for the table.
// * Load "property" with updates
// * Implement payments!

// Write Tests
// - the rest of sectionSetter and varbSetter tests
// - the actor tests

// Upload to Heroku
// Implement paying for Pro
// Make the mainSectionLoadMenu use GenericAutoComplete
// Make a video demo/ad

// Hide the save menus behind a click; label their buttons.
// Always have "Save New"; also have "Save Updates", "Make Copy", "Saved Plural"

reportWebVitals();
