import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - implement SuperTokens...

// Ok. The new login works.
// I can verify basic auth that way.
// But I need to still implement the subscription-based login
// And I must get the user's state.

// On login, on the server, create a user in the db with the info
// from the session. Use a variable called userId

// After login, on the client, check for "session.isLoggedIn"
// if it is logged in, but the state doesn't indicate that it is
// logged in, call the server and get the logged in user,
// and the subscription token

// make another thing that logs out the user on the front-end
// if session.loggedIn is false

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
