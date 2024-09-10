### DealLab Client

[Live Test Website](https://wwww.homeestimator.net)

## Description:

The client side of a fullstack application. Uses Typescript with React and Styled Components. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The main purpose of this application is to produce estimates for the return on investment (ROI) of rental properties. To that end, the user inputs information related to a property as well as to whatever financing and property management they might use to purchase and manage the property.

In order for the many inputs and derrivative variables to solve for ROI and other outputs, the application uses a topological sort, which takes as input interdependent nodes and creates a valid sequence of processes based on the dependencies of each node, which works so long as there are no circular dependencies. A warning will be added to alert the user when they create a circular dependency.

To minimize repetitious data entry, users can save and load properties, loans, and property management instances to reuse for subsequent analyses. Further, most input variables can receive equations as inputs, and those equations can utilize other variables to generate dynamic values and so further reduce data entry. As a simplified example, a user might fill out the home insurance cost field like this:

&nbsp;Home insurance: property_sqft/2

That field will then update whenever the property's square feet field is updated. Users can thus define generalizable equations for fields so as to reduce the number of fields into which they must enter data for future analyses. Additionally, users may create and save custom variables to be plugged into equations. They might save the costs of various common repairs, for instance, to be reused for analyses when relevant.

Finally, the application is transparent in that the user can view and explore the tree of equations and variables that produced the ROI and other output variables.

## Technology used

#### Front-End

- React - Used to create components and the front end of the application
- TSX - Used in with React to create the front end of the website
- Styled Components - Used to style the website with CSS in JS
- Axios - Used to make API calls to the server
- Jest - Used for unit tests

#### Back-End

See here: https://github.com/busterbyron/Property-Analyzer-Server-Side

## Built With:

- VS Code - https://code.visualstudio.com/

## Contact:

If you would like more information about the app, please don't hesitate to reach out.

Byron Broughten

- [GitHub](https://github.com/ByronBroughten)
