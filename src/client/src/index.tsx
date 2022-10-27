import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// If I'm going to make tables faster and increase functionality, here's how:
// There are going to be example properties, loans, and mgmts.
// I want the tables to reflect those
// - When creating the default user, initialize the tables
// - When creating a user, send the tables to the db
// - When logging in, load the saved table (and check it)
//   - remove extra rows
//   - add missing rows (to the front)
//   - update row information
// - When adding, updating, or deleting a section, adjust
//   the front-end table accordingly in real-time

// Before Marketing
// - The userVarb info doesn't know which userVarbList to access the varb from
//   The problem could be solved either by making a new kind of info or just
//   by using the userVarb dbId, which shouldn't have a duplicate.
// - For speed, changing the save check should give the most bang for buck

// - When I flip the switch from one editor to another, the value from the
//   last editor is still retained
// - I think the problems will be solved if I use one editor
//   for dollars and one for percent.
//   then the actual dollars and percent values will both update
//   accordingly based on the switches
//

// - Fix the mgmt inputs so that loding a management works properly with sync

// - In the load menu, highlight the one that is loaded with green or purple
// - Add an icon option to the sectionBtns
// - Make compare and actions have an icon
// - Maybe change load button's icons and label
// - Think about making the menu hidable (arrow next to menu icon?)
// - Hide "Ongoing Costs" and "Upfront Costs" initially
//   - Create an "Add List Group" button, styled like the list group section
//   - If there is no list group, put it in place of it
//   - Make childDefaultAdders that take priority over regular default adders
//   - Make the main sections start without their list groups
//   - Give each of them child defaults
// - Think about changing all numbers and strings to numObj and stringObj
// - Get numObj editorText to display updated in-entity text. But also, it should keep depreciated in-entity text. It has to cache.

// Extra stuff
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

// Demo Link: https://www.youtube.com/watch?v=wGfb8xX2FsI

// Redux state sync https://github.com/AOHUA/redux-state-sync#readme

/* 
I've been computer programming for awhile now, and after massively underestimating it, managed to make an app. Check it out, eh? And if you know anyone interested in rental property, I would love if they beta test it. https://www.youtube.com/watch?v=wGfb8xX2FsI
*/

// I'm making an app for analyzing rental property. These are the main goals:
// - Analyze properties faster and more precisely;
// - Experiment with different combinations of loans and properties
// - Save and reuse data

// 1. Analyze properties faster
// 2. Be as precise as you prefer
// 3. Save and experiment with different combinations of loans and properties
// 4. Allow for custom inputs and outputs (still working on this)
// Right now it's in the beta testing stage. I'm looking for people to try it out, report bugs, and give any and all feedback, really. For beta, everything it can do is free. Most of what it can do will be free in the end.
// Here's a brief video demo:  https://www.youtube.com/watch?v=wGfb8xX2FsI
// Here's a link to the app: https://www.ultimatepropertyanalyzer.com/
// If you will try it and provide me with feedback, I would greatly appreciate it. 😊

// - User solverSections in MainSection
// - "getUserData" sometimes returns 401 - unauthorized

// - Make main menu always present. Stylize buttons differently when user isn't logged in.
// - Put userName (or first letter of email) on the right side where sign in/sign up were

// Last steps to Ultimate Property Analyzer
// 1. User variables - make their entity displayName update.

// 2. Lists - add something that indicates whether list is saved or autoSyncOn.
// Or remove this for now.

// make numObj and stringObj keys match

// When I change the displayName of a variable, I want that
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

// Basically, copy the menu from the property title menu
// edit that menu to handle full stores.

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
//   a subscription. This might not be a problem.
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
// I could make the lists be "advanced"

// - more difficult. I would have to use an "onlyOne" property in
//   the childSections section, or something, then go through all of the
//   property's descendants to make sure they all have their bare minimum
//   onlyOnes.

reportWebVitals();
