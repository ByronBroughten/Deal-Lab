import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// - Removing a loan after saving and creating
//   new isn't working for some reason

// - Deleted saved loans are coming back when
//   I reload the app.

// - Refresh is losing state
// - Fix losing the deal state after login and register
// - Fix state revert not acting how it should
//   when addSection fails
//   - It says there are no sections to load, but the
//   - actions menu still acts like the loan is saved
// - User solverSections in MainSection
// - "getUserData" returned 401 - unauthorized
// - mgmt

// - Fix variable labels for things with same
//   names accross sections (Upfront expenses, etc)

// Make a video of the present functionality without
// the BETA sign

// Make a Beta feedback panel
// - Email address
// - Discord
// - Direct message box?

// Disable getUserData on the backend unless
// the email has been verified

// Try beta testing for one month.
// - Make all the features (the one) free
// - Add a "Beta flag"
// - Make a large, "Feedback" button that shows email and
//   discord
// - Try adding the other four things during beta.

// For it to truly be an ultimate property analyzer, I need 4 more things:
// 1. Bring back the custom variables/variable lists
// 2. Bring back custom outputs/output lists
//    - outputLists might be on the same page as custom variables
// 3. Bring back custom additive lists
//    - singleTimeList
//    - ongoingList
// 4. Bring back deal compare
//    - implement property compare, etc

// Cherries on top
// 5. Api variables
// 6. Sharing things with other users

// - Record new demo video in one go
// - Record demo audio in increments

// - get rid of login and register stuff

// 1. When a subscription is active (or inactive), getUserData and updateSubscription
//    should return the subscription header like they're supposed to
//    - This will require parsing the json
//    - You will want to borrow from the stripe webhook

// 2. Think about fixing the css register bug
// - A session is created after register but before email verification
// - There is a post-email-verification feature that I could use
//   to create the new user

// - Think about the race condition on the front-end for someone starting
//   a subscription. This might notbe a problem.
//   - The FE waits one second
//   - The FE sends the request to update its subscription
//   - the subscription is not yet there—there is no subscription
//     that was made recently, or no subscription that has never been
//     obtained by the front end

// Launch the app on Sunday.
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

// You probably want example lists and variables.

reportWebVitals();
