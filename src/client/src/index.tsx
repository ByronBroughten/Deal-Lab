import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// PropertyAnalyzer.App?

// Honestly, it's probably ready for actions, though.
// It's definitely ready for me to make a demo.

// 1. When a subscription is active, getUserData and updateSubscription
//    should return the subscription header like they're supposed to
//    - This will require parsing the json

// 2. Think about fixing the css register bug
// - I'd need to implement a way to delete a dev user.
// - I might add a route, "deleteUser", that only works in dev mode
//   It would send the logged-in user's email and totally delete them
// - Think about the race condition on the front-end for someone starting
//   a subscription. This might not even be a problem, though. Try it out.
//   - The FE waits one second
//   - The FE sends the request to update its subscription
//   - the subscription is not yet there—there is no subscription
//     that was made recently, or no subscription that has never been
//     obtained by the front end

// Launch the app on Sunday.
// - Make a video demo
// - Post it, asking people for input
//   *Reddit
//    - r/realestateinvesting
//    - r/realestate
//    - r/landlords
//    - answer people's questions about how to size up properties
//    - Reddit ads
//   *Podcast ads
//    - Optimal finance daily
//   *Quora
//    - answer people's questions about how to size-up property
//   * Youtube ads
//   * Facebook ads
//    - banner
// - Post on the bigger pockets forum
// - Get an "influencer" to showcase it?

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

// Think about making a guest user that has two example properties.
// No, you probably want example lists and variables, instead.

reportWebVitals();
