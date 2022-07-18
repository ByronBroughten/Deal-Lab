import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - get loadedVarb to work right
// for this, I just need to fix the way I'm loading things

// unit - is it ok that "one" is a numObj? Yeah, it probably doesn't matter.
// it would be slightly more appropriate if I used a regular number
// I think I will use a regular number
// I don't need to make an editor for it.

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
