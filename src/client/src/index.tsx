import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// So what's happeneing is, the sectionPack has an invalid (depreciated) varbName.
// I don't necessarily want it to fail for that reason.
// I think the front-end should be allowed to accept sectionPacks that have old
// data, lack new data, and allow for db artifacts like _id.

// I could do a much looser validation. It's the front-end after all.
// Allowing for _id might be too loose, though. I basically wouldn't be validating it at all.
// Maybe I shouldn't validate them.
// Or I should only validate what will be used from them. Functional validation.k

// Maybe update homebuyer mode to get people's opinions on it
// Make sure examples in defaultDbStore have dateTimeSaved

// Restrict editing to only the n most recently created deals
// - Maintain a session section that has dbId and timeCreated for each deal
// - It gets sent on login with userData
// - It's synced with add deal and remove deal

// Restrict adding more than n deals
// - use the session section to see how many total deals there are

// Implement dealCompare cache
// - add the cache section
// - update dbStore
// - make adding and removing deals to compare update the cache dbIds
// - update the section to save on CompareSection to be the cache section
// - make getUserData properly implement dealsToCompare from the cache
// - make the mainDealMenu drop the outputLists and be session-dependent

// (you really do need these tests to uncover any numerical errors)
// Add tests for mgmt
// Make property tests for brrrr
// Make some deal tests for each of the dealTypes

// Add more examples
// - Example mgmt
// - Example loan

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

// - Get user variable displayNames to update mainText and entities of numObjs

// Ordered loading
// - load the deals and components using separate requests

// Add homebuyer variables?
// (not necessary, but easy)
// - likeability
// - purchase price per likability
// - upfrontInvestment
// - monthlyHousingBudget
// Add an easy CapEx default for homebuyer mode (1% or 2% purchase price)
// Re-add an easy CapEx default for buyAndHold and brrrr (20% rent)
// Taylor the maintenance defaults for homebuyer mode
// Is there an easy utilities default homeBuyer?
// - Ongoing payments towards principle/towards not principle

// Ducktype sectionPack validation so you don't have to fill out db sectionPacks

// Make SolverSections test suite to test the reducer actions

// Somehow link some default child functionality with the selfPackLoader
// updater.finishNewSection(). Maybe default sections can take parents conditionally

// Add optional description information to property (address, parking, lot size, zoning, MLS number?, notes)

// Add pictures for property

// Other deal compare features
// - save outputList
// - load outputList

// Add public housing data api

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
