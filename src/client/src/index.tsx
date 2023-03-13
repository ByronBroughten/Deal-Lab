import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// - After the next commit
//   - check whether the upgrade to pro button works (it works in dev)

// - Add FixNFlip
//   - Add ARV
//   - Add holding period
//   - Add holding costs
//     - Holding utilities
//     - Holding misc
//   - Add cost overrun

// - There could be contractor management costs

// How should I handle the loan being able to cover repair costs?
// DealCheck uses two boxes for that.
// - Financed repair cost
// - Financed property cost

//   - Percent of repairs for loan amount
//   - Percent of repairs plus purchase price
//   - Percent of ARV (when in other modes)
//   - Change completion status based on focalDeal's mode
//   - Change which sections of property are shown based on focalDeal's mode
//   - Holding costs (clone of ongoing costs)
//   - Add fix and flip outputs
//   - Change displayed outputs based on mode

// - Add Brrrrr
//   - Change controls for refinance loan vs regular loan

// - Try upgrading to mui-5. That will make styling easier

// - Implement the account page
//   - This involves changing the other pages
// - Then add a footer

// - Add down payment
// - Add loanPurpose
// "For"
//   - Property purchase price
//   - Upfront repairs
//   - Purchase price and repairs
// - Implement down payment on loan
// Should I use a radio? Yeah, I guess so.
// * Enter down payment
// * Enter loan amount
// - Put the downpayment stuff on financing
// - PITI, too

// - Lay the groundwork for boolean userVarbs
//   - Change numVarbItem to numVarbItem

// - Add boolVarbList and boolVarbItem
// - add boolVarbList and boolVarbItem
// - add boolObj (mainText, entities)
//  - mainText allows for operators

// - Allow for upgrades to the state without having to delete
//   all user data
//  - Make stored sectionPacks rawSections be a partial (apart from the main one)
//  - Make sectionPacks be able to have null
//  - Make it so that whenever a stored sectionPack is loaded,
//    missing sections are added but converted to null
//  - When self-loading a sectionPack, don't replace
//    the sections of self that the sectionPack has a null for

// - Custom outputs groups
//  - You already have the outputList component—now you need outputSection
//  - outputSection will have three "slots" for loading an output list
//  - The compare page doesn't need such slots. You just pick the output group
//  - Different one display depending on whether mode is buy/hold, fixFlip, brrrr
//  - Save and load output groups for deal compare and output

// Need Emily
// - Logo

// Add more examples
// - Example mgmt
// - Example loan

// Wordpress
// - Landing page/description
// - Contact us
// - About us?
// - Extended blog pieces?
// - Pricing?

// Consult branding, logo, and pro wordpress people
// https://bstro.com/

// Fix and flip notes:
// - Loans can be used to pay not only for the property
//   purchase price, but for the rehab costs, too.
//   That is, they can be a percentage of the rehab costs.

// - Closing costs are called purchase costs with fix and flip
//   - Or you could say, "purchase closing costs"

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

// - Holding costs has its own category, which is basically
//   "ongoing costs". Ongoing costs could be called holding costs.
//   Many of the property's basic information would be considered
//   holding costs
//   You would just change the title of Ongoing Costs to Holding Costs
//   Or you would add both and keep them separate

// - One-Time costs would include both Purchase Costs (Loan closing costs)
// and Selling Costs (6% ARV, on the property).

// 4.
// -Give property the necessary vabs for buyAndHold and fixAndFlip
// -Give deal the necessary varbs for buyAndHold and fixAndFlip
// -Give deal an outputSection per mode
//  outputBuyAndHold
//  outputFixAndFlip
//  the varbs in those sections are things like, "showCocRoi", "showPitiPayments", etc.
//  They also have childSection virtualVarbs called "customOutputs"

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
