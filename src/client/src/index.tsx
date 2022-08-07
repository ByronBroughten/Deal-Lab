import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - Use the same code for creating a user throughout everything
// - Test getUserData

// - Make a useEffect on the frontEnd that attempts to update the
//   front-end subscriptionInfo if the fullPlan planExp is out of date
//   Is that necessary?

// - Test getSection with loading a deal with updated property

// - Test addSection
// - Test the pro stuff
// - Test that the header updates when appropriate (make sure this is implemented on the client)
// - Test that addSection only accepts certain sectionNames
// - Include that test in update/delete/get

// - Test the payment url route

// - Test the two Stripe webhooks.
//   - Create my own webhook events that simulate the ones stripe would send
//   - Use "generateTestHeaderString" to add a header that works

// - Write a test to verify that the calculations work as expected
// - Think about what to do about the little "Show Details" bugs

// - Make a video demo/ad

reportWebVitals();
