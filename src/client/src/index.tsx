import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - Test that PI calculates correctly for at least two scenarios
// - Test that upfront investment calculates correctly
// - Test that cash flow calculates correctly

// - Try it with two loans at once

// - Test getSection with loading a deal with updated property

// Marketing
// - Make a video demo
// - Post to reddit
// - Post on the bigger pockets forum
// - Make an ad
// - Use the ad on facebook
// - Use the ad on YouTube
// - Get an "influencer" to showcase it?

// - get rid of login and register stuff

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
