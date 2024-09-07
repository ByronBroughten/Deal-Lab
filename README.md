### DealLab

## Purpose and Overview
The purpose of Deallab is to help beginner and experienced real estate investors analyze real estate deals with minimal data entry and high potential for experimentation. It calculates metrics for analyzing real estate and allows users to save and swap out parts of deals and use equations with responsive variables in place of simple numeric inputs. More details about the app’s function can be found on its landing page.

The app is full stack, with a client and server, both of which are written in Typescript.

The app is structured as a monorepo in which the client’s files are nested inside the server repository. This is to let the server access a subset of code used by the client, located in /sharedWithServer. Below is a simplified sketch of the general file structure.

      DealLab  
      |–package.json  
      |–/src  
      |–|–index.ts (server)  
      |–|–/routes  
      |–|–/client  
      |–|–|–package.json  
      |–|–|–/src  
      |–|–|–|–index.ts (client)  
      |–|–|–|–/Components  
      |–|–|–|–/sharedWithServer  

## Shared Resources
/sharedWithServer contains eight categories of code that are shared between the client and server. This code largely structures the app.

__Constants__: configuration values for things like coordinating the routes between client api calls and server endpoints, as well as other parameters.

__stateSchemas__: defines the building blocks of the app in terms of “sections” and “variables”.

Sections represent deals, properties, loans, menus, and many other things. Each type of section may have one or more instances and has a defined set of variables attached to it (more on variables soon). Sections can also have children, i.e., other sections nested under them, and each type of section has a defined set of permissible child sections. For example, deals may have “property” and “financing” child sections, properties may have units, etc. When a section is deleted, so too are its children. There are around 80 different types of sections.

Variables are attached to sections and contain values that may be updated. For example, properties have variables for things like their purchase price, year built, address, and so on. The values that variables contain can be numbers, booleans, strings, or specific object types.  Some values, like a property’s purchase price, may be updated by the user’s input. Conversely, some values are the products of calculations involving other variables. For example, a deal’s return on investment value is the product of its annual cash flow value divided by its total investment value. stateSchemas define which variables have which types of values as well as the way in which each is updated. There are hundreds of variables.

Both the state on the front-end and the MongoDb database on the back-end rely on definitions from stateSchemas to structure and/or validate data. That is, a property being saved to the database is constrained to having the same allowable children and variables as a property in state on the front-end, based on the same shared schemas, the single source of truth

Many Typescript types are also derived from stateSchemas and are shared across the client and server. This allows for full-stack type safe code with regard to core app structures.

__State__: classes that are designed to allow for updates while preventing mutations. Each instance of state can comprise many different sections, though there is always a section of type “root” that is the top ancestor of the other sections. While state is used for displaying and updating data on the front-end, it can also be used on the back-end to take advantage of all the robust ways there are to access and manipulate data in the form of State, described more below.

__StateGetters__: classes used to access state data from the perspective of particular aspects of state, i.e., from the perspective of particular sections, variables, or from the overview. For example, there is a GetterSection class of which each instance represents a particular section in State and has methods for retrieving data in relation to that section. For example: 

    const property = GetterOverview.section(“property”, propertyId);

    const purchasePrice = property.variable(“purchasePrice”);

    const num: number = purchasePrice.value();

    const unit1 = property.firstChild(“unit”);

    const deal = property.parent(“deal);

    const cashFlow = deal.variable(“cashFlow”);

The methods of these classes constrain which parameters may be fed to them depending on what the class instance represents. For example, it will only let you retrieve a “purchasePrice” variable from GetterSection<“property”>. Further, outputs are also typed, so the IDE can tell you the type of the value had by GetterVariable<“property”, “purchasePrice”>. All such typing is based on the stateSchemas.

__StateOperators__: classes for updating state. These are similar to the StateGetters, but rather than merely navigate and retrieve pieces of state they can also create new state instances with updated values.

      property.variable(“purchasePrice”).update(250000);

__StateOperators__ have a private “store” property, which is an object that holds state. The store is shared across all connected instances of StateGetters and StateOperators. When a StateOperator completes a state update, the old State instance in the store is replaced with the updated State instance. From there, more operations may be carried out until the desired state is reached.

Example:

      property.variable(“purchasePrice”).update(250000);

      const unit = property.firstChild(“unit”);
      
      unit.variable(“rent”).update(1500);
      
*After these operations, both “property” and “unit” would reference state with the updated values for both purchasePrice and rent*

Further, there are multiple levels of StateOperators. The most basic level is simply for adding and removing child sections and updating single values. The higher levels encapsulate the more basic levels and manage additional tasks like solving for all of the variables that are supposed to be solved after each basic operation, and solving them all in the right order. For example, after the purchasePrice variable is updated, so too will need to be any variable that is a function of the purchase price, such as possibly the down payment, loan amount, mortgage payment amount, and cash flow, in that order (among other variables).

__StateTransports__: used for sending structured data from the front-end to the server and vice-versa, or for storing data in caches. Essentially, they are pojo representations of sections that can be loaded into state instances. Their structures are defined by Typescript types derived from the stateSchemas.

The most common transport type is SectionPack (i.e., SectionPack<“property”>, SectionPack<“deal”>, etc.) which contains all the data of a section’s variables and its children.

__ApiQueries__: types for coordinating requests and responses between the client and server and for ensuring that proper requests and responses are used in query tests, whether on the front-end or back-end.

__Utils__: simple utility functions that are relevant to both the client and server.

## Front End
The front-end uses React with hooks. All the React components are functional and use lifecycle hooks to access and manipulate state. StateGetters are used in components for displaying state data to the user. For example, below is a simple representation of a Property component:

      const property = useGetterSection(“property”, props.id);
      return (
        <StyledSection>
          <VariableInput id=property.varbId(“purchasePrice”)>
          <VariableInput id=property.varbId(“yearBuilt”)>
          …
        </StyledSection>
      )

All state operations are conducted through a reducer from React’s useReducer lifecycle hook, and all reducer actions use StateOperators for creating updated state instances before passing the updated state to the DOM. There are convenience hooks for accessing common reducer operations, such as useAddChild, useRemoveSection, and useUpdateValue.

Styling is accomplished primarily using the system of Material UI 5, i.e., Emotion. However, the styled-components library was used previously, and there is still a significant amount of that in the codebase that is being phased out. All styling is “css in JS” and thus contained in the TS files of React components. 

For inputs, DraftJS is used because it grants the styling flexibility needed to represent input variables as highlighted text in input fields, and because it lets the width of inputs adjust in response to the dynamic width of input values.

HTTP requests to the server are made using Axios, which is wrapped in a typed interface to ensure that api queries use valid routes and payloads.

Finally, the front-end uses a couple of services. Stripe is used for allowing users to make payments through a portal provided by Stripe, and SuperTokens is used for user authentication through a UI provided by SuperTokens.

## Back End
Express.js is used to handle incoming HTTP requests from the client and from Stripe and SuperTokens.

MongoDb is used for the database with mongoose, which is encapsulated in a class with convenience functions that uses the terminology of sections and variables.

As stated before, the back-end has all the same data manipulation capabilities as the front-end, as it has access to StateOperators.

## Testing
Unit testing is performed with jest. Most of the current tests are for top-level state operations and api queries.

## Possible Projects
1. Enable the app to load property listing data from an api to optionally fill inputs for things like purchase price, year built, annual taxes, and whatever else.
    * An api that could possibly be used to implement this: https://www.rentcast.io/api
    * Another option is to create a web-scraper that gathers data from online listing websites.

2. Enable users to circle an area on a map, filter the types of properties they want to analyze, and apply a responsive deal template to the filtered properties in the circled area such that all of the properties are analyzed at once according to the user’s specifications.
    * This would require the accomplishment of project 1.

3. Transition the app from Create React App to Next.js
    * This is needed in order to upgrade the current deployment from a depreciating Heroku stack to a newer stack.

4. Fully transition the app to the Material UI 5 styling system.
    * This would simply involve replacing the rest of the components based on Styled-Components with Material UI components and styling.

5. Figure out and implement a way to deploy the codebase as a mobile app for IOS and Android with minimal code duplication, assuming the UI can be managed with styling breakpoints.

6. Reduce throughput between the client and server and between the server and database when deals are edited and saved.
    * The main challenge with this is to implement a way to update aspects of sections in the database rather than overwriting entire sections after even just small edits. For example, instead of replacing an entire saved deal when the user edits a property’s purchase price, as is the case now, it would save just the purchase price variable, or perhaps that variable and all of the other connected solved variables.

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
