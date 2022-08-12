import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Test these things
// - make property ongoing expenses include taxes and home insurance
// - make a new loan variable called ongoingCosts, which includes
//   mortgage insurance and loan payments
// - make financing have ongoingCosts as well
// - move PITI and downpayment to Final
// - fix FinancingInfo
// - fix things that depend on downpayment
// - make final's "ongoingCosts" sum the three ongoingCosts
//   and not draw from PITI

// Launch the app on Sunday.
// - Make a video demo
// - Make a video ad
// - Make have a little ad banner made
// - Figure out where to post it
//   *Reddit
//    - r/realestateinvesting
//    - r/realestate
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

// - Test that PI calculates correctly for at least two scenarios
// - Try it with two loans at once

// - Test getSection with loading a deal with updated property

// - get rid of login and register stuff

// Marketing

// - Make a video demo
// - Post to reddit
// - Post on the bigger pockets forum
// - Make an ad
// - Use the ad on facebook
// - Use the ad on YouTube
// - Get an "influencer" to showcase it?

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

// Style the buttons so that they match the color and placement of the things they add(?)
// - This is a little tricky for Unit

reportWebVitals();
