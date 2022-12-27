import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// See about consulting Taylor's UI/UX person

// Consult a branding and logo-making
// https://bstro.com/

// Consult marketers re advertising wp page
// 3. Add example property/loan/mgmt/deal for loading and media

// 1. Show some unusable actions as disabled
// 2. Begin adding modes (add the underpinnings for them)
// 3. Implement a "Load" modal to only present "Actions" button

// 8. Begin to add modes for buyHold and fixFlip (buyHoldSell, brrrr, and wholesale come later)
//  Every property should have all the necessary inputs for each, but
//  they are activated based on the mode of activeDeal

//   Mode is adjustable on each deal
//   Each deal has an outputSection per mode
//   outputBuyAndHold
//   outputFixAndFlip
//   outputBuyHoldSell
//   outputBrrrr
//   outputtWholesale

//   And each of those sections has default varbs, as well as a varb
//   for each of those default varbs that controls whether the varb
//   is displayed, via checkbox.

//   In addition to the defaults constrolled by checkboxes, custom variables
//   can be loaded as well.

//   Each of those output sections can be saved by mode
//   Lists of custom variables to use as outputs should also be savable

//   property should have a mode property that receives from activeDeal's
//   mode property, and that should determine whether some of property's
//   variables produce "?"

// 4. Make repairs, utilities, etc, be able to be singular values
//    that can switch to being itemizable.
//    When they are in itemize mode, a modal is summoned with a full,
//    spacious menu for editing the list and list items.

// 5. Make compareTable columns editable
// 6. Add info hover-ey thingies next to outputs and maybe some inputs

// If I'm going to make tables faster and increase functionality, here's how:
// I want the tables to reflect those
// - When creating the default user, initialize the tables
// - When creating a user, send the tables to the db
// - When logging in, load the saved table (and check it)
//   - remove extra rows
//   - add missing rows (to the front)
//   - update row information
// - When adding, updating, or deleting a section, adjust
//   the front-end table accordingly in real-time

// Extra stuff
// - In the load menu, highlight the one that is loaded with green or purple
// - Load rows according to whether autoSync is On
// - Implement column features

// Get beta users:
// 1. Post it on facebook/insta, asking for testers
// 2. Maybe try posting to facebook groups
// 3. Ask Ed to have a look at it
// 4. Maybe attend an RE meetup or two

// After Beta User attempt
// - Put Upgrade To Pro button back
// - Consult with a marketing agency
// - Make a video
// - Hire a marketing agency
// - Landing page with high SEO
// - Done with the app unless it makes any money

// Demo Link: https://youtu.be/81Ed3e54YS8

// 0. More efficient and better suited to the task than spreadsheets
// 1. Analyze properties faster
// 2. Be as precise as you prefer
// 3. Save and experiment with different combinations of loans and properties
// 4. Allow for custom inputs and outputs (still working on this)
// Right now it's in the beta testing stage. I'm looking for people to try it out, report bugs, and give any and all feedback, really. For beta, everything it can do is free. Most of what it can do will be free in the end.
// Here's a brief video demo:  https://www.youtube.com/watch?v=wGfb8xX2FsI
// Here's a link to the app: https://www.ultimatepropertyanalyzer.com/
// If you will try it and provide me with feedback, I would greatly appreciate it. 😊

// - Put userName (or first letter of email) on the right side where sign in/sign up were
// - When I change the displayName of a variable, I want that
// of its output to change, right?

// 2.5 Allow custom variables on property, loan, and mgmt (add guts, at least)
// - customVarb entityInfo updateFn updates the local value and gives an inEntity
//   to the varb it targets with source, "customVarb"
// - userVarbs check for entities with source "customVarb" and sums their values
// - customVarb editor is basicVarb editor with loaded displayName
// - is it possible to set editorLength based on title?
// - "Add Variable" button needed on basicInfo

// 3. Bring back custom outputs/output lists
// Analysis output list:
// Now I need a complex version of the menu

// Maybe give lists a "simple" and an "itemized" mode.
// This would require adding an additional value to the list.

// Maybe add an "Add Ongoing Costs" button to Management

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
//   a subscription. This might not be a problem.
//   - The FE waits one second
//   - The FE sends the request to update its subscription
//   - the subscription is not yet there—there is no subscription
//     that was made recently, or no subscription that has never been
//     obtained by the front end

// - Maybe disable getUserData on the backend unless
//   the email has been verified

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
// - Make roadmap
// - Network effect
//   - Link with other accounts
//   - Share variables, lists, properties, etc
//   - Forum, or a reddit thread or discord
//     This would be too much I think

reportWebVitals();
