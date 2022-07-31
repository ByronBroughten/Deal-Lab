import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - implement SuperTokens...

// - Test the pro stuff in addSection.test
// - Test that addSection only accepts certain sectionNames
// - Include the test in update/delete/get

// - Test getSection with loading a deal with updated property

// - Test the payment url route
// - Test that the header updates when appropriate in addSection

// - Test the two Stripe webhooks.
//   - Create my own webhook events that simulate the ones stripe would send
//   - Use "generateTestHeaderString" to add a header that works

// - Make a useEffect on the frontEnd that attempts to update the
//   front-end subscriptionInfo if the fullPlan planExp is out of date

// - Add basic Google Analytics
// - Write a test to verify that the calculations work as expected
// - Think about what to do about the little "Show Details" bugs

// - Upload to Heroku
// - Make a video demo/ad

reportWebVitals();
