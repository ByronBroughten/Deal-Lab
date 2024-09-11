import React from "react";
import ReactDOM from "react-dom";
import { App } from "./Components/App";

ReactDOM.render(<App />, document.getElementById("root"));

// remove styled-somponents

// Utility checkboxes update slowly after being clicked
// Xing out a utility line item causes crash
// Add switch for Misc Income
// Add switch for Misc Upfront Costs in Management(?)
// Add switch for Misc Ongoing Costs in Management(?)
// Or a switch for owner managed and external managed or something?

// Add switch? and (i) for misc ongoing costs
// Instead of Enter Amount, put "Lump Sum"

// "mongodb://localhost/HomeEstimator-Test"

// Add prepaids section to loan for taxes (months), home insurance (months), and mortgage interest (days)

// Get rid of 5% baseLoan varb?

// Prepaids will be a switch that opens a modal.
// The modal will show the three prepaid values, and maybe a list table for custom ones.
// Maybe upfront costs and delayed costs will work the same way.
// Nice, I like it.

// Add delayedRepairs section to property

// Make it so editing a deal does not directly update the sessionDeals
// Rather, the affected session deals reload at the home screen...?

// Editing the deal's name in Saved Deals causes the whole deal
// to solve.
// Two options
// 1. Add a "don't solve" option to updateValue (easy)
// 2. Transition to sessionDeals (eliminates technical debt)

// - Only use the sessionDeal in Saved Deals
// - Make editing the sessionDeal's displayName trigger:
// 1. Fetching the deal, updating its displayName, saving
// 2. A new route that updates the deal's displayName, and then also updating
//    feStore deal's displayName

// Allow for loading from an existing deal
// when creating a new deal(?)
// There'd be a toggle, then a dropdown
// loadDeal, dropDown of deal names
// - That's how you'd be able to turn a homebuyer deal into
//   a rental property

// Values to make for loading zillow data eventually:
// yearBuilt
// squareFeet
// numBedrooms
// interestRate
// loanTerm

// targetRent(?)
// purchasePrice
// taxes
// homeInsurance

// I would have to:
// - make a separate sectionName for each of them
//   - Each one for now would just have a valueSourceName and...
//   - There would be many different types of valueEditor
//     - valueDollarsEditor, valueEditor, etc...
//     - maybe valueDollarsEditor should just be valueEditor
//       - and valuePercentEditor can remain as such
// - They'd all have valueEditor and valueSourceName
// - Then their parent would have a value that just grabs the
//   valueEditor value: boom
// - More complex, larger properties
// - make their current inputs draw from their values
// - edit the defaults

// Ongoing mortgage ins should have an option to be a percent
// of the loan amount
// - I made the mortgage ins value sections
// -

// Allow drawing in national averages from the api.

// Allow switching between month and year inputs

// It'd look nicer if New Deal took you to a page
// where the dropdown still works and defaults to Homebuyer
// (that would avoid confusion)

// Options for addressing SolverSections/TopOperator in tests
// 1. Edit it and SolverSection so they use TopOperator internally
// 2. Slowly transition tests to TopOperator and call solve explicitely where
//    needed

// Speed objective: Update outVarbs for addChild and updateValue without updating all outvarbs throughout the app
// This might reduce bugs by letting me put back the check
// for trying to remove entities that aren't there.
// - When a section is added, it has inVarbs. I can find
//   those pretty easily and add them, no problem.
// - However, it also has outVarbs. Presently, I can't find those
//   without searching through the whole app

// Redo how sections are saved and retrieved
// - Actually save them to the db, and don't load them until you need to.

// - I need to maintain a map of varbContextId—context.userVarbId/fixedVarbName
//   - And they point to a list of varbIds (for varbs that have them as inVarbs)
// - Then when I add or update a varb, I check its varbContextId, and assign
//   - it as an outVarb accordingly
// - This will effectively let you get rid of appWideAddEntities

// The create deal page has a dropdown:
// 1. create with data from Zillow - Address needed
// 2. create from saved deal
// 3. start from scratch

// on createDeal, create a deal. if not 3, we also retrieve a dealPack from the server and load it.

// Make a server route called createDeal

// if 1. the use node-zillow to get what data you want. You need the address.
//  - get the property posting data if there is any and mortgage rates
//  - create a deal from it and send it up.

// if 2.
//  - load from the db and do yo' thang

// Once you get it working, you should try to consult with Zillow
// regarding branding of the data. You might need to track with numObj whether
// data was loaded with Zillow or whether it was inputted.

// Add other "more info" buttons to the info modals.

// make new deals loadable from current deals

// add options to homebuyer mode for rent and
// multi-family mode

// add 1% rule monthly/yearly
// add 1% rule sqft average monthly/yearly

// *Speed up
// 1. Don't solve after every keystroke.
// - make StateSections contain SolveShare
// - but it need not operate on SolveShare

// - make AddSolverSection
// - get rid of SolverSections

// 2. Don't load deals till you need them

// 3. Make saving happen faster, or cancel on keystroke, or not happen as often
// -

// Don't load deals till you need them
// This is a pretty big undertaking. Is it worth it right now?
// I'm afraid that the changes I start making here will make it difficult to
// implement changes regarding the broken API
// This won't deal with the select component at all, though.
// I want to be able to fix the select component without pushing this all through, though.
// I can hop over to a different branch.

// - dealCompare and editDeal will now be query actions. They both start with,
//   loadNeededDeals
//   - Make a route for fetching multiples—getSections
// - For now, dealCompare relies on the deals being there.
//   - Make it start with loadNeededDeals, then proceed.
// - EditDeal should also start with loadNeededDeals
// - AddDeal should pretty much work as is
// - CopyDeal could also just start with loadNeededDeals (love it)
// - RemoveDeal just needs to do a check before removing the deal in feStore
// - A special route for editing a section's displayName or displayNameEditor
// - Don't load deals at the outset.

// Loading a deal to feStore and then activating it is slower than just loading
// it in an activated state, ala editDeal. Hmmm. That's probably fine for now.

// Should I get rid of displayNameEditor? I should either get rid of it, or
// give it to all the stored sections.

// * Marketing *
// - Consult marketing people
// - Consult wordpress site SEO people
// - Consult wordpress builders https://bstro.com/

// - Hire a marketing agency
// - Hire someone to boost SEO
// - Make videos
// - Reddit ads
// - Podcast ads
// - Optimal finance daily, etc
// - Quora adds
// - Youtube ads
// - Facebook ads
// - Banner ads
// - The bigger pockets forum
// - Get an influencer to showcase it
// Done with the app unless it makes any money

// Mobile passability
// - Test it out on your phone

// Get the email in feStore and show which account is logged in

// "Add Deal" takes a long time.
// - add something for showing a loading circle for it

// "Edit Deal" takes a pretty long time, too
// - add something for showing a loading circle for it

// Make sumNums not show zeros
// - I'd need to fix it at the prop-gathering stage

// - Closing costs should have "zero" option
// - Cost overrun should have 10% option
// - Split BRRRR into Holding Phase and Ongoing Phase. Put rent in Ongoing Phase
// - Maybe remove "Turn Key" option from Fix & Flip and BRRRR

// - BRRRR should show "holding costs" on property
// - Show BRRRR ROI and CoC ROI on Saved Deals

// Add a loading indicator when "edit" is clicked for deal.
// Also do it for adding a new deal
// - dealMenu variable loadingEdit: dbId | ""
// - when edit is clicked, this variable is switched on
// - a useEffect triggers the edit command
// - the loading command sets the varb back to ""

// Unite ValueInEntityInfo, VarbPathNameInfo, and the variable labels.

// - Adjust the varbs that Financing DealSubSectionClosed shows

// - Get user variable displayNames to update mainText and entities of numObjs

// Ordered loading
// - load the deals and components using separate requests

// Make SolverSections test suite to test the reducer actions

// Somehow link some default child functionality with the selfPackLoader
// updater.finishNewSection(). Maybe default sections can take parents conditionally

// Add optional description information to property (address, parking, lot size, zoning, MLS number?, notes)

// Add pictures for property

// Other deal compare features
// - save outputList
// - load outputList

// Add public housing data api

// Eliminate manual allDisplaySectionVarbs
// - automate periodic and span start and end adornments
// - delete clutterful manual inputs

// Outputs
// - Somehow allow restoring to default
// - Add passFail outputs
// - Add customVariables to property
// - Add optional fixed variables to property

// Add the following
// - Appreciation (property—particularly good for homebuyer)
// - Income increase (property)
// - Expense increase/inflation (property maintenance and mgmt)
// - Optional Selling Costs for buyAndHold

// "Add multiple", or "add group", button for units

// Add a unit label?
// Add unit sqft?
// Add tags to deals?
// Add a short description to deals?

// - Allow for upgrades to the state without having to delete
//   all user data
//  - Make stored sectionPacks rawSections be a partial (apart from the main one)
//  - Make sectionPacks be able to have null
//  - Make it so that whenever a stored sectionPack is loaded,
//    missing sections are added but converted to null
//  - When self-loading a sectionPack, don't replace
//    the sections of self that the sectionPack has a null for

// Old demo link: https://youtu.be/81Ed3e54YS8

// - Put userName (or first letter of email) on the right side where sign in/sign up were

// Allow custom variables on property, loan, and mgmt (add guts, at least)
// - customVarb entityInfo updateFn updates the local value and gives an inEntity
//   to the varb it targets with source, "customVarb"
// - userVarbs check for entities with source "customVarb" and sums their values
// - customVarb editor is basicVarb editor with loaded displayName
// - is it possible to set editorLength based on title?
// - "Add Variable" button needed on basicInfo

// Sharing things with other users
// - Send a sharing invite to another user based on their email
// - If they accept, you can grant them readonly or edit access
//   to whatever they'd like
//   - This would obviously work best if I can get websockets going

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
