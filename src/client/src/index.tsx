import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// Ok. What do I have to do?
// - Limit storage (addSection) if the user only has basic authorization
// - Allow storage if the user has a full subscription
// - Test those two things in addSection.test
// - Make it so addSection only accepts certain sectionNames
//   - Do this for updateSection, deleteSection, getSection, and replaceSectionArr
// - Indicate on the front-end when saving is now allowed due to storage. Try an info dot.
// - If the Jwt is expired, make it attempt to update the Jwt
// - Make it succeed if a valid subscription is present in the db
// - Make it fail if no such subscription exists in the db

// - Figure out which sections will be savable and add them as children to the db
//   (even if for now they will be empty)

// - Make a useEffect on the frontEnd that attempts to update the
//   front-end subscriptionInfo if the planExp is out of date

// - Test the payment url route

// - If someone is pro
//   - make their name have a yellow backdrop

// - Test the two Stripe webhooks.
//   - Create my own webhook events that simulate the ones stripe would send
//   - Use "generateTestHeaderString" to add a header that works

// - Update the Properties menu. Just change the button
// - If you feel like it, stick a filter on top of the menu
//   - For this, you wouldn't even need persistent state.
// - Add "load" to the left of each property name

// - Load Deal with updated property, loan, and mgmt
//   - This is almost done. You just need a way to tell
//   it which dbStores to use
//   - You also need to create some kind of loop that says
//     which sections to use as a focal point next (parents down to children)

// rename "user" section to "userInfo", or "publicUserInfo"
// same with serverUser—privateUserInfo, maybe

// - Add basic Google Analytics
// - Write a test to verify that the calculations work as expected
// - Think about what to do about the little "Show Details" bugs

// - Upload to Heroku
// - Make a video demo/ad

reportWebVitals();
