import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// Create a custom confirmation dialogue.
// It's state has "doSubmit" and "doCancel"

// Why does it have async bullshit?

// Ask for Marina, Ed, and Kate to give feedback

// Market precision and accuracy with transparency

// Take screenshots

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

// "Add Deal" takes a long time.
// - add something for showing a loading circle for it

// "Edit Deal" takes a pretty long time, too
// - add something for showing a loading circle for it

// Make sumNums not show zeros
// - I'd need to fix it at the prop-gathering stage

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
