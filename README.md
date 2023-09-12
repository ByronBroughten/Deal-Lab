### HomeEstimator

Deployed at [homeestimator.net](https://www.homeestimator.net/)

## Functional Description

This fullstack web application is designed to produce estimates that are useful for sizing up real estate deals. The estimates it produces include the cashflow, total investment, and return on investment (ROI) of any given deal.

To that end, the user may enter information about a rental property as well as about whatever financing they'd use to purchase it and whatever costs they'd incure to manage it. As the user enters information, the input values feed into calculations that produce other derrivative variables (like monthly loan payment amounts, total monthly expenses, etc) which ultimately solve for the outputs (ROI, etc).

Users may enter variables into the input fields such that input fields may automatically adjust in response to one another. For example, in the field dedicated to the cost of heating a property, the user may enter something like this: "property-sqft \* 0.05". Then if the property's square feet is increased, so too is the entered heating cost.

In addition to carrying out calculations and allowing for interdependent inputs and variables, the app lets users save properties, management service providers, loans, custom variables, custom lists of variables, and whole deals. The user can then load up any of that information, copy and tweak it, delete it, and compare things like saved properties and deals side-by-side in a table format.

All of the app's features can be used for free, but the user is limited in the amount of data they can save unless they upgrade to a Pro account by paying a subscription fee.

Finally, the user can login with either an email and password or with a Facebook or Google account.

## Structural Description

This codebase contains both the client and server sides of the app. To ease deploying both the client and server to a single machine, the client code is nested in the server code at src/client.

The vast majority of the codebase is written with Typescript, using React on the front-end and Node.js on the back-end.

The client side also has HTML and CSS interwoven throughout using Styled Components. It also incorporates some React Native via React Native for Web.

The server facilitates CRUD operations and serves as an intermediary between the client and a MongoDB database. It produces and validates JSON web tokens to safeguard user-specific operations, and it validates the structure of incoming data before allowing it to be written to the database.

Some environment-agnostic Typescript code is shared accross the client and server, which can be found at src/client/sharedwithserver. This includes various types that help coordinate request and response payloads as well as various modular classes that ease the manipulation and querying of data structures common accross the app, representing things like users, properties, and deals.

Because the user can change how inputs depend on one another by entering or removing them as variables, the app's variables end up forming a dynamic dependency tree. To accomodate this, the app uses a topological sort, which essentially takes in ids of interdependent variables, each paired with the ids of their dependencies, and spits out a valid sequence of ids. That sequence is updated and followed whenever the values of the inputs and derrivative variables are calculated.

SuperTokens is integrated as a micro service to implement OAuth 2.0 user registration and login well as a username and password flow that includes email validation and password resetting.

Stripe is integrated as a micro service to handle payments, user subscriptions, and payment information.

## Technology Used

#### Front-End

- React
- CSS/Styled Components
- Axios
- Jest
- Stripe
- SuperTokens

#### Back-End

- Node.js
- Express
- MongoDB
- Zod (validation schema library)
- Mongoose
- Jest
- Stripe
- SuperTokens

## Built With

- VS Code - https://code.visualstudio.com/

## Contact

If you would like more information about the app, please don't hesitate to reach out.

Byron Broughten

- byron.broughten@gmail.com
- [GitHub](https://github.com/ByronBroughten)
