import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// - Write a test to verify that the calculations work as expected
//   - Make a property
//   - Add some units and expenses to it—keep track of the numbers
//   - Make a loan, and then a mgmt
//   - Add some stuff to those in the same way
//   - Manually calculate some stuff

// One issue is that calculating the load will be dificult.
// I mean, I can use the loan calculation I hardcoded, I guess
// But the loan calculation itself should be tested.
// So maybe, yes, use it, but test it separately, too.
// "the loan calculation should work"—test with two sets of numbers
// against an online loan calculator
// do the same for if it's interest only

// - Make a video demo/ad

// - get rid of login and register

// - Test getSection with loading a deal with updated property

// - Test addSection
// - Test the pro stuff
// - Test that the header updates when appropriate (make sure this is implemented on the client)
// - Test that addSection only accepts certain sectionNames
// - Include that test in update/delete/get

// - Make a useEffect on the frontEnd that attempts to update the
//   front-end subscriptionInfo if the fullPlan planExp is out of date
//   Is that necessary?

// - Test the two Stripe webhooks.
//   - Create my own webhook events that simulate the ones stripe would send
//   - Use "generateTestHeaderString" to add a header that works

// - Think about what to do about the little "Show Details" bugs

reportWebVitals();
