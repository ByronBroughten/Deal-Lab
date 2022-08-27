import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// is it a waste of space for each userVarbItem to have
// three conditional rows?
// The alternative is for it to have something else that
// has the conditional rows. That somthing else gets
// added if its not there when needed. And it gets deleted
// when its not needed, on save.
// Yeah, I like the idea of decoupling.

// Demo Link: https://www.youtube.com/watch?v=wGfb8xX2FsI

// Possible quick tutorials:
// Overview
// Analyze deals
// Reduce data entry
// - Reusing properties for different scenarios
// - Custom variables
// - Custom lists
// - api variables?
// Suit your needs
// - Custom variables
// - Custom outputs
// Compare deals

// Do I want to use the same variable names for the dopdown as I do for the ones in the equations? Yes, I think I do. At least for display purposes.

// - User solverSections in MainSection
// - "getUserData" sometimes returns 401 - unauthorized

// - Fix variable labels for things with same
//   names accross sections (Upfront expenses, etc)

// For it to truly be an ultimate property analyzer, I need 4 more things:
// 1. Bring back the custom variables/variable lists

// - Fix the wrong value type bug
// - Get the variables to be used effectively as custom variables.

// - Create the variables page.
// - Track whether the variables are effectively saved using isEqual.
// - If the user tries to leave when they're not saved, warn them.

// I like displaying the equals for totally user-defined variables.
// To each userVarb value, add "isPureUserVarb".
// Each time a userVarb value updates, that thing updates based on inVarbs.
// This is only necessary for userVarb varbs.

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

// 1. When a subscription is active (or inactive), getUserData and updateSubscription
//    should return the subscription header like they're supposed to
//    - This will require parsing the json
//    - You will want to borrow from the stripe webhook

// 2. Think about fixing the css register bug
// - A session is created after register but before email verification
// - There is a post-email-verification feature that I could use
//   to create the new user

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
//    - answer people's questions about how to analyze property
//   * Youtube ads
//   * Facebook ads
//    - banner
// - Post on the bigger pockets forum
// - Get an "influencer" to showcase it?

// - Think about the race condition on the front-end for someone starting
//   a subscription. This might notbe a problem.
//   - The FE waits one second
//   - The FE sends the request to update its subscription
//   - the subscription is not yet there—there is no subscription
//     that was made recently, or no subscription that has never been
//     obtained by the front end

// - Maybe implement social login
// - Maybe disable getUserData on the backend unless
//   the email has been verified

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

// Be more like Google—put the menu on the left side.

reportWebVitals();
