### Ultimate Property Analyzer

Deployed at [ultimatepropertyanalyzer.com](https://www.ultimatepropertyanalyzer.com/)

## Functional Description

This is a fullstack web application designed to produce useful estimates for determining the appeal of a given real estate deal. The estimates it produces include cashflow, total investment, and return on investment (ROI). To this end, the user is invited to enter information about a property as well as about whatever financing they'd use to purchase it and whatever costs they'd incure to manage it.

As the user enters information, the input values feed into calculations that produce other derrivative variables (the monthly loan payment amount, total monthly expenses, etc) that ultimately solve for the outputs (ROI, etc).

A complication arises, however, from the fact that the dependency tree of the inputs and derrivative variables is dynamic. That's because users may enter variables into the inputs to make inputs adjust automatically in response to one another. For example, the user may enter something like this in the field dedicated to the cost of heating a property: "property-sqft \* 0.05". Then if the property's square feet is increased, so too is its heating cost.

To accomodate the dynamic nature of the dependency tree, the app uses a topological sort, which takes in identifiers of interdependent nodes, each paired with the identifiers of their dependencies, and produces a valid sequence of processes. That sequence is then used to calculate the values of the inputs and derrivative variables in a valid order.

In addition to carrying calculations and allowing for interdependent inputs and variables, the app lets users save properties, management service providers, loans, custom variables, custom lists of variables, and entire deals. The user can then load up said information, copy and tweak it, delete it, and compare saved properties and deals side-by-side in a table.

All of the app's features can be used for free, but the amount of data that a user can save is limited unless they pay $8 per month.

## Structural Description

This codebase contains both the client and server sides of this application. To ease deploying both the client and server to a single machine, the client code is neatly nested within the server code, at src/client.

The whole codebase is written using Typescript, with React on the front-end and Node.js on the back-end. The client side also has HTML and CSS interwoven throughout using Styled Components. The server connects to a MongoDB database.

The server carries out CRUD operations between the client and the database; it produces and validates JSON web tokens to safeguard user-specific operations; it validates incoming data before saving to the database.

Some environment-agnostic Typescript code is shared accross the client and server. This includes various types to help coordinate request and response payloads as well as various modular classes that ease the manipulation and querying of common data structures representing things like properties and deals.

SuperTokens is integrated as a micro service to implement OAuth 2.0 user registration and login using Facebook and Google as well as a username and password flow that includes email validation and password resetting.

Stripe is integrated as a micro service to handle paid user subscriptions, payments, and payment information.

## Technology Used

#### Front-End

- React
- Styled Components
- Axios
- Jest

#### Back-End

- Node.js
- Express
- MongoDB
- Zod (validation schema library)
- Mongoose
- Jest

## Built With

- VS Code - https://code.visualstudio.com/

## Contact

If you would like more information about the app, please don't hesitate to reach out.

Byron Broughten

- byron.broughten@gmail.com
- [GitHub](https://github.com/ByronBroughten)
