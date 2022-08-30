import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Demo Link: https://www.youtube.com/watch?v=wGfb8xX2FsI
/* 
I've been computer programming for awhile now and finally managed to make an app, check it out. And if you know anyone interested in rental property, I would love if they beta test it. https://www.youtube.com/watch?v=wGfb8xX2FsI
*/

// - Get numObj editorText to display updated in-entity text. But also, it should keep
//   depreciated in-entity text. So it has to cache.

// - User solverSections in MainSection
// - "getUserData" sometimes returns 401 - unauthorized

// - Make main menu always present. Stylize buttons differently when user isn't logged in.
// - Put userName on the right side

// For it to truly be an ultimate property analyzer, I need 4 more things:
// 1. Bring back the custom variables/variable lists
// - Saving when not logged in
//   - 1. call it something else (like "set")
//   - 2. don't allow saving
// - If the user tries to leave when they're not saved, warn them.

// - To each userVarb value, add "isPureUserVarb". This can be added onto varb

// - Each time a userVarb value updates, that thing updates based on inVarbs.
// - Use that value to determine whether to show equals sign in numObj editor

// 2. Bring back custom outputs/output lists
//    - outputLists might be on the same page as custom variables
// 3. Bring back custom additive lists
//  - For this, you can mostly just copy what you did with userVarbs
//    - singleTimeList
//    - ongoingList
// 4. Bring back deal compare
// - Generate the table from the db every time
//    - implement property compare, etc
// Cherries on top
// 5. Api variables
// 6. Sharing things with other users
// - Send a sharing invite to another user based on their email
// - If they accept, you can grant them readonly or edit access
//   to whatever they'd like
//   - This would obviously work best if I can get websockets going

// 1. When a subscription is active (or inactive), getUserData and updateSubscription
//    should return the subscription header like they're supposed to
//    - This will require parsing the json
//    - You will want to borrow from the stripe webhook

// 2. Think about fixing the css register bug
// - A session is created after register but before email verification
// - Maybe I could use the post-email-verification feature that I could use
//   to create the new user

// Launch the app.
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

// - Do I want to use the same variable names for the dropdown as I do for the ones in the equations? Yes, I think I do. At least for display purposes.
// - Ah, but that wouldn't differentiate userVarb sections.
// - I would need a way to differentiate those, too.
// 1. Perhaps it can optionally show the sectionName in bold above the entity.
//    If the sectionName is too long, though, that doesn't work
// 2. Optionally add the sectionName to the front of the variable.
//    This is an ok solution. Perhaps if you click the entity it does this.
// 3. Add a small menu to the entities. It shows the sectionName, and some options

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
