import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// ongoingItem - Fine, except loadedVarb isn't working right (displayName, updates one step behind, etc)

// unit - is it ok that "one" is a numObj? Yeah, it probably doesn't matter.
// it would be slightly more appropriate if I used a regular number
// and created an updateFn for such.

// - get loadedVarb to work right
// - make outputItem work like loadedVarbs, so that it actually harbors the value
// and displayName of its varb. It also harbors the varb's displayName, too, and its inEntityInfo.

// Do I need that now? I guess I do.
// I don't have to worry just yet about the loadedVarb being a virtual varb, though.

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
