import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// Manage the pro stuff

// - Create a new route to get updated state and token related to someone's pro status
// - Create something on feUser called "updateSubscription", which calls that route
//   and updates state
// - if the path has subscriptionSuccessUrlEnd, that should trigger attempts
//   I think that's the only way that stripe gives to do it. Very well.
// - Test the new route.
// - Implement a useEffect that checks whether the subscription expried, and if it has,
//   it attempts to update it.

// - Test the addSection pro stuff
//   - Test that header updates when appropriate (make sure this happens on addSection)
//   - Actually, I don't need that necessarily. I just need something on the frontend
//     that tries to update when the subscription is over. A separate function.

// - Test that addSection only accepts certain sectionNames
//   Copy and paste that test for update/delete/get
// - Implement an analagous test for the sectionArr route

// - Make a useEffect on the frontEnd that attempts to update the
//   front-end subscriptionInfo if the fullPlan planExp is out of date

// - Test the two Stripe webhooks.
//   - Create my own webhook events that simulate the ones stripe would send
//   - Use "generateTestHeaderString" to add a header that works

// - Test that financing PI calculates correctly
//   For two loans at once, one of which is interest only

// Launch the app on Sunday.
// - Make a video demo
// - Make a video ad
// - Make have a little ad banner made
// - Figure out where to post it
//   *Reddit
//    - r/realestateinvesting
//    - r/realestate
//    - r/landlords
//    - answer people's questions about how to size up properties
//    - Reddit ads
//   *Quora
//    - answer people's questions about how to size-up property
//   * Youtube ads
//   * Facebook ads
//    - banner

// Possible roadmap
// - Roadmap
// - Custom variables
// - Custom lists
// - Network effect
//   - Link with other accounts
//   - Share variables, lists, properties, etc
//   - Forum, or a reddit thread or discord
//     This would be too much I think

// It would be good to break up theme
// themeBtn.ts
// theme.btn.
// etc.

// - get rid of login and register stuff
// - get rid of editorUpdate and the editorUpdateToggle

// Marketing
// - Make a video demo
// - Post to reddit
// - Post on the bigger pockets forum
// - Make an ad
// - Use the ad on facebook
// - Use the ad on YouTube
// - Get an "influencer" to showcase it?

// Think about making a guest user that has two example properties.
// No, you probably want example lists and variables, instead.

reportWebVitals();
