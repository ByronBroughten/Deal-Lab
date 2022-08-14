import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - Make annual loanPayment draw from loan months
// - Add a step for transitioning each percent to a decimal
// - Get rid of doFinishingTouches
// - Add a date value that is a number
// - Make the date variables be the date value

// - Make the roi displayed in values have more decimal places.
//   - This is happening because it's not using the unitType of the
//     loaded varb. It should get that from the loadedVarb.
//     - Add a variable to the section called, "unitType",
//       which affects the rounding.
//     - Make every variable have "unitType"

// - Test the two Stripe webhooks.
//   - Try the test clock
//   - Add the user of the email you want to use

//   - And/or create your own webhook events that simulate the ones stripe would send
//   - Use "generateTestHeaderString" to add a header that works

//  - Think about the race condition on the front-end for starting
//    a subscription

// Launch the app on Sunday.
// - Make a video demo
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

// Make an ad

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
