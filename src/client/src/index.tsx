import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Maybe give ListEditorMenu "SavedLists >"
// - This is trickier. You'll have to make some kind of "view" property
// on main.

// The lists page should look a lot like the
// deals page.
// The list sections should act like Property
// When they open up, you see all the lists in the
// form they are now.
// No need for the modal yet.

// Try not using "builder" in FeIndexSolver

// Before Marina
// - Down payment for loan
// - Make different stores for different lists (Repairs, Utilities, CapEx, Ongoing, SingleTime)
// - Info dot for Lists

// Before Emily
// - Pretty much ready

// Marina
// - Pretty much ready
// - Ask for general input

// Emily
// - Logo
// - How to handle UI for different (but not different) types of lists?

// Before Wordpress
// - Add Fix and Flip
//   - Percent of repairs for loan amount
//   - Percent of repairs plus purchase price
//   - Percent of ARV (when in other modes)
//   - Change completion status based on focalDeal's mode
//   - Change which sections of property are shown based on focalDeal's mode
//   - Holding costs (clone of ongoing costs)
//   - Add fix and flip outputs
//   - Change displayed outputs based on mode
//   - Add mode to "Compare" and change parameters
//     being compared

// - Add Brrrr

// Wordpress
// - Make a site that does the job

// - Add an info dot to the variables selector modal
// - Give it the "All Variables" thing a displayNameFull filter

// 2. Finalize the variables
// - Put the downpayment stuff on financing
// - PITI, too

// - Add an explanation to the Variables page
// - Add an explanation to the Lists page

// - Organize lists into multiple sections: CapEx, Utilities, Closing Costs, General Costs, General Ongoing Costs.

// 4. Allow for Fix and Flip
//  - Add ARV
//  - Add holding costs (Like ongoing costs but just has utilities and custom)
// 4.5 Allow for Brrrr
//  - Differentiate between purchase and refinance loans (right?)
//  - Add Post-Purchase loan

// 7. Make a full output page.

// 1. Change updateSection so that it only takes updateVarb
//    options and provides default rounding based on baseSectionVarbs

// Options for how to spend this evening:
// 3. Work on adding the underpinnings of the modes
// 5. Work on the examples

// If I have the capEx list relatively stable.
// And if I have the utilities list relatively stable.
// Do I need lists?
// I still need a way to load the big default capEx list.
// It would be nice for people to edit the big default one, too.
// It would be nice to have a separate capEx list section.

// Update the lists UI
// - Show property rent.

// How should the units be added? Should I add a unit-adder modal?
// That's not a bad idea.
// I could just display, "3 Units", "$3000/month rent", edit units
// Then clicking "+ Unit" could summon a modal that asks for BRs, rent, and number of simlar units. Then the unit is added and can be edited, just like now. These things aren't that hard.

// - Make valueSection child lists get their displayName
//   from the value's displayName, at least initially. Does
//   that make sense?

// - Make a new list that do
// - Make an example mgmt and loan
// - Make the deal example contain a different property (dbId, title, units, etc), and maybe a different loan and mgmt.
// - Get rid of the list menus
//   Have an option to just show the xBtn on hover

// Updating Loan UI
// How should I handle the loan being able to cover repair costs?
// DealCheck uses two boxes for that.
// - Financed repair cost
// - Financed property cost

// - Perhaps untie the load modal from the menu that
//   shows the load button.
// - Make the actions buttons not get in the way of the section they pertain to

// I need a new block.
// It will be able to switch between these three things:
// Single expense (name field and cost field)
// - It will have labeled a labeled editor for the expense's name and its cost
// - To the right of the name, or above or below the name, it will have a selector for for switching between the types of expenses.

// This will take some work. Do I want to do this? I guess so.

// 4. Start gathering tax documents—maybe that's a Monday project

// Consult branding, logo, and pro wordpress people
// https://bstro.com/

// UI Update
// 1. Make an un-itemized cost an option for singleTimeList
// 2. Do the same for ongoingList
// 3. Make a modal for editing itemized lists, which includes the
//    whole list menu
// 4. Start by displaying only the name and value of the cost list
//    and add an "edit" button
// 5. Think about making the cost list viewable

// 6. Add an example loan/mgmt/deal for loading and media
//    Make them usable for all deal modes

// Fix and flip notes:
// - Loans can be used to pay not only for the property
//   purchase price, but for the rehab costs, too.
//   That is, they can be a percentage of the rehab costs.

// - Closing costs are called purchase costs with fix and flip

// - Cost overrun is a property variable—
//   add a certain percent to the rehab costs cause we always underestimate
//   It's kind of like the CapEx and maintenance budget

// BRRRR will involve both holding costs and ongoing costs
// - There can still be one purchase price, in
//   One Time Costs

// - Property taxes will play into both
// - Insurance will also play into both.
// - But it could be for two separate rates—one for holding costs, and one
//   for ongoing.

// - Ongoing costs

// - The comping is amazing

// - Holding costs has its own category, which is basically
//   "ongoing costs". Ongoing costs could be called holding costs.
//   Many of the property's basic information would be considered
//   holding costs
//   You would just change the title of Ongoing Costs to Holding Costs
//   Or you would add both and keep them separate

// - One-Time costs would include both Purchase Costs (Loan closing costs)
// and Selling Costs (6% ARV, on the property).

//   It might not make sense to let properties function both as
//   buyAndHold and as

// Should the example sections contain each other?
// It might be easier if they don't.
// Then I don't have to worry as much about the Saved/unsaved
// changes status

// 2. Begin adding underpinnings of modes
// 4.
// -Give property the necessary vabs for buyAndHold and fixAndFlip
// -Give deal the necessary varbs for buyAndHold and fixAndFlip
// -Give deal an outputSection per mode
//  outputBuyAndHold
//  outputFixAndFlip
//  the varbs in those sections are things like, "showCocRoi", "showPitiPayments", etc.
//  They also have childSection virtualVarbs called "customOutputs"

// -Make sure it has a store for custom output lists, too

// -make the example property and deal work with all modes
// -add other modes: buyHoldSell, brrrr, and wholesale

// -Add the mode switch next to Deal
// -Make a property Component for each mode
// -Make an output component for each mode,
//  or make one that can be generalizable.

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
