import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Should dealMode be selected when you create a new deal?
// Should dealMode not be changable?
// These two things seem to make sense.
// Then deal would only need one property, with one propertyType

// - Add homeBuyer mode (no income)
//   - Buy and hold basics
//   - ongoing costs (utilities, capEx, maintenance (this will be low... unless you have kids, misc ongoing costs))
//   - numBedrooms input
//   - rehab (misc oneTime costs)
//   - outputs: totalInvestment (Cash Investment), monthlyExpenses, totalInterestPaid, totalPrincipal paid

// See if Marina and Kate 'O will look at it

// - Add dealMode to dealCompare, to change:
//   - deals that show up the search
//   - variables that show up in column select
//   - the set of columns that is activated
//     - Mixed will have (totalInvestment, annualizedRoi, and CoCROI)

// - Add tests for fixAndFlip

// - Add Brrrr
//   - Mostly the same inputs and outputs as b&h + f&f
//   - I'll have to differentiate between a buy loan and a refi loan

// - just put completionStatus on the sections
// - make SolverSections test suite to test the reducer actions

// Make the Wordpress site
// Which advantages do I want to list on WP?
// - Compare deals side by side
// - Use custom variables
// - Break deals down into reusable parts
// - Modes for home buyers, landlords, fix and flippers, and more
// - Gain confidence that you're getting the best deal you can

// Launch
// - restrict editing to only the n most recent deals
// - Make output lists customizable
// - Add passFail outputs
// - Add customVariables to property
// - Add public housing data api

// 70% Rule
// - Implement dealMode outputs lists

// See if Emily will look at Fix and Flip—have her weigh in
// on if I should copy that style for Buy and Hold

/* 
  I'd need a good way to add info dots where necessary

  Buy and Hold new order:
  - Basics: price, sqft, units
  - Ongoing costs: taxes, insurance, Utilities, CapEx, Maintenance
  - Rehab
  - Custom expensese (?)
*/
/* 
  Fix and Flip Optimal:
  - Selling costs is its own FormSection value at the end
  - Holding Costs has an extra little itemizer
    with checkboxes for accounting, legal, and landscaping
*/

// Custom
// misc upfrontCosts (custom upfront)

// "makeDefault" can now have props. I should include that in the
// "addChild" props

// How many completionStatuses would there be? Maybe just one,
// with overrides

// Add Closing Costs - Custom Percent of base loan

// New Loan situation
// - rethink completionStatus?

// - Figure out how to display two values under one label,
//   with a light grey divider in between them (or just one value
//   if only one is provided)

// - Figure out how to display everything when purchasePrice & repairs
//   is selected

// Now, how do I handle the problem of being able to use
// loans both for the purchase and refinance phase?

// 1. Leave things basically as they are—loans are flexible and
//    have all three options no matter what. Whatever is entered is entered,
//    even if it doesn't really make sense to have ARV in the purchase phase

// 3. Make loans just have "percent of price". When they're
//    in the refinance slot, it's from ARV. When they're in the purchase
//    slot, it's from purchasePrice

// - Add FixNFlip
// Add the necessary inputs
// * After Repair Value

// Purchase Loan
// Down payment or Loan Amount
// Loan amount method
//  % of Purchase Price
//  % of Rehab Costs
//  % Price and Rehab Costs

// DollarAmount

// Create a separate sectionValue for each of those
// downPayment % or loanAmount %

// purchasePriceLoanAmount

// Refinance Loan
// * percentOf ARV

// - Probably factor repairs into loans
// - Also factor in downPayments
// Add the necessary outputs
// Create default a default output list for each
// Add overrides to the component completionStatuses

// Add multiple units at once
// Add optional description information to property (parking, lot size, zoning, MLS number?, notes)
// Display units in groups of like units (2) Unit Info; (1) Unit Info;
// Add a unit label?
// Add unit sqft?
// Add "property type" to property, to open up different fields
// Add a full address to properties? (Street, city, state, zipcode) with autofill
// Add tags to deals?
// Add a short description to deals?

//  - Copy DealCheck
//   - Add ARV
//   - Add holding period
//   - Add holding costs
//     - Holding utilities
//     - Holding misc
//   - Add cost overrun
//   - Contractor management costs for mgmt?

// Add more differentiating stats for Financing and Property
// Add address for property
// Maybe add a way to load property right from deal menu

// - Add empty dbChildIds to DbStore, to control the orders of components
//   - They'll likely be pretty easy to update, later.

// - Possibly give price, taxes, and insurance valueSections, and
// any other pure inputs, to future proof your ability to incorporate
// api modes

// - Figure out if there's a way to use mui sx with mobile

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

// - Implement the account page
//   - This involves changing the other pages
// - Then add a footer

// - Add down payment UI
// - Add loanPurpose UI
// "For"
//   - Property purchase price
//   - Upfront repairs
//   - Purchase price and repairs
// - Implement down payment on loan
// Should I use a radio? Yeah, I guess so.
// * Enter down payment
// * Enter loan amount

// - Allow for upgrades to the state without having to delete
//   all user data
//  - Make stored sectionPacks rawSections be a partial (apart from the main one)
//  - Make sectionPacks be able to have null
//  - Make it so that whenever a stored sectionPack is loaded,
//    missing sections are added but converted to null
//  - When self-loading a sectionPack, don't replace
//    the sections of self that the sectionPack has a null for

// - It would be nice to allow for fields to have placeholders, in which
//   case the styling for their labels would be different

// Eventually: Restrict editing to the *save limit* most recent sections when the
// user has a basicPlan

// Output Section
// - Manage Outputs button—Modal that shows the outputs displayed for each deal mode, and that allows for editing, saving, and loading them
// - Display outputs depending on dealmode
// - Add outputs Component section

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

// One of the easier ways to get started, the way I did, is to buy a duplex with a loan that had a relatively low down payment. An FHA loan could work—that goes as low as 3.5% down. In Saint Paul, you could probably find a decent duplex for $250,000. That would be an $8750 down payment. You'd need to save somewhat more than that, though, to cover some closing costs and meet bank requirements for having extra funds on hand. So you'd need to save maybe like $15,000-$18,000.
