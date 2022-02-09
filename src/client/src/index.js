import React from "react";
import { StylesProvider } from "@material-ui/core";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Normalize } from "styled-normalize";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "./App/theme/Theme";

// Make analysis be main.
// Is it possible to make Analyzer initialize from a sub-branch?
// In that case, it would have a "head" sectionName
// The head would have no parent, and only children
// would be allowable SectionNames
// And the head would be an "alwaysOne"

// I can flatten everything on the db and just use more dbSectionNames

// The rowIndex varb will be populated by the corresponding rowIndex on
// the clientSide. The rest will be populated by the current entry.
// It rowIndex on the clientSide could have a "rowInfo" subSection to guarantee
// no varb naming conflicts, and that subSection would be populated from the
// clientSide one. Ehhhh.
// Then I could add multiple "rowInfo" dbSections. propertyRowIndexInfo, etc.

// It would be nice to get rid of dbEntry[], and have just dbSections
// Each dbSections would need a head, though, right? With a dbId and sectionName
// to point to the head.
// Get would get the main section, then get its children, then get their
// children
// Delete would work in a simliar way.
// When deleting, you wouldn't have to remove from the parent. You could just
// update the parent when trying to access the child.
// You could also include the parentInfo on the child if it is not the head.

// Putting would be a little tricky—you would have to compare the children and
// delete the ones that are no longer there
// You would need to use more dbSectionNames to avoid dbId conflicts. analysisProperty, etc

// 9. Analyze some properties for debugging purposes
// 10. launch on Heroku

// lessons
// - derive union types from the Types that represent the very objects they will be indexing
// - refactoring from the inside-out is bce.
// - Don't use maps/objects if the values are ultimately ordered. Just put them
//   in an array rather than create a separate array with their ids that you'd
//   then have to query and keep synced.
// - It's great to compose state of class objects whose methods produce new objects
//   rather than mutate
// - Things seem easier if the property keys of like-objects are consistent
// - The more that you can maintain a single source of truth, the better. This means
//   producing values on the fly with functions rather than keeping them synced
// - Build in composable increments, like with the current molds, rather than with
//   big sweeping structures, like the old molds.
// - I made the decision to make sectionNames typesafe, and I think
//   that at this stage it was a mistake. Too much code must be refactored.
//   I didn't do it in a modular way.

// try using the portal for VarbAutoComplete and passing styles into it somehow.
// or figure out how to make it go up if there's not enough room down.

// Little silouiette of a house?
// Little robot mascot? Lol.
// https://ultimate-property-analyzer.herokuapp.com/

const root = document.getElementById("root");
console.log("entrypoint");
ReactDOM.render(
  <React.StrictMode>
    <Normalize />
    <BrowserRouter>
      <StylesProvider injectFirst>
        <Theme>
          <App />
        </Theme>
      </StylesProvider>
    </BrowserRouter>
  </React.StrictMode>,
  root
);

reportWebVitals();
