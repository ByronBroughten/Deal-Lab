import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

const SectionCrateGQL = new GraphQLObjectType({
  name: "SectionCrate",
  description: "A single sectionCrate of specified sectionName and dbId",
  // there
  fields: () => ({
    dbId: { type: GraphQLString },
    // Add other properties of SectionCrate that you would like to be able to
    // individually query.
  }),
});

const InSectionCrateGQL = new GraphQLInputObjectType({
  name: "InSectionCrate",
  description: "A single sectionCrate of specified sectionName and dbId",
  // there
  fields: () => ({
    dbId: { type: GraphQLString },
    // Add other properties of SectionCrate that you would like to be able to
    // individually query.
  }),
});

const RootQueryGQL = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    // user: {

    // },
    // user has sectionLists, sectionList has sections
    sectionList: {
      type: new GraphQLList(SectionCrateGQL),
      description:
        "A list of all of a user's section crates of a specified sectionName",
      args: {
        sectionName: { type: GraphQLString },
      },
      resolve: (parent, { sectionName }) => ({}),
    },
    section: {
      type: SectionCrateGQL,
    },
  }),
});

const RootMutationGQL = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addSection: {
      type: SectionCrateGQL,
      description: "Add a section",
      args: {
        dbId: { type: GraphQLString },
        crate: { type: InSectionCrateGQL },
      },
      resolve: (parent, { sectionCrate }) => {
        // add sectionCrate to mongoDb database
        return { dbId: "testId" };
      },
    },
  }),
});

export const gqlSchema = new GraphQLSchema({
  query: RootQueryGQL,
  mutation: RootMutationGQL,
});
