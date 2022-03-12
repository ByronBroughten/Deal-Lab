import { extendUrl } from "./utils/url";

const dev = {
  name: "Analyzer Client — Development",
  endpoint: "http://localhost:5000/",
};

const prod = {
  name: "Analyzer Client — Production",
  endpoint: "https://ultimate-property-analyzer.herokuapp.com/",
};

// index should have utils, constants,

const constants = process.env.NODE_ENV === "development" ? dev : prod;

export const config = {
  name: constants.name,
  url: {
    bit: {
      user: "/api/user",
      dbEntry: "/api/dbEntry",
    },
    get api() {
      return {
        main: constants.endpoint,
        user: extendUrl(constants.endpoint, this.bit.user),
        dbEntry: extendUrl(constants.endpoint, this.bit.dbEntry),
        get sectionArr() {
          return extendUrl(this.dbEntry, "all/");
        },
        get tableColumns() {
          return extendUrl(this.sectionArr, "columns/");
        },
        get defaultSection() {
          return extendUrl(this.dbEntry, "defaultSection/");
        },
      };
    },
  },
};
