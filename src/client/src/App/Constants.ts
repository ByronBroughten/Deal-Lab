import { extendUrl } from "./utils/url";

const dev = {
  name: "Analyzer Client — Development",
  endpoint: "http://localhost:5000/api/",
};

const prod = {
  name: "Analyzer Client — Production",
  endpoint: "https://ultimate-property-analyzer.herokuapp.com/api/",
};

// index should have utils, constants,

const constants = process.env.NODE_ENV === "development" ? dev : prod;

export const config = {
  name: constants.name,
  url: {
    api: {
      main: constants.endpoint,
      get user() {
        return extendUrl(this.main, "user/");
      },
      get dbEntry() {
        return extendUrl(this.main, "dbEntry/");
      },
      get sectionArr() {
        return extendUrl(this.dbEntry, "all/");
      },
      get tableColumns() {
        return extendUrl(this.sectionArr, "columns/");
      },
      get defaultSection() {
        return extendUrl(this.dbEntry, "defaultSection/");
      },
    },
  },
};
