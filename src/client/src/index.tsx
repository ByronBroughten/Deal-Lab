import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// PropertyAnalyzer.App?

// 1. Finish testing webhook functionality for each event type with users that you create.
// 2. Think about fixing the css register bug

//  - Think about the race condition on the front-end for someone starting
//    a subscription. You need the front-end to wait to get the user data
//    from the backend until it is there. Or try once every one second, or something.

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
