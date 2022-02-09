import { extendUrl } from "./utils/url";

const dev = {
  name: "Analyzer Client — Development",
  endpoint: "http://localhost:5000/api/",
} as const;

const appUrl = "https://ultimate-property-analyzer.herokuapp.com";
const serverUrl = extendUrl(appUrl, "api");

const serverRoutes = {
  main: {
    path: "/api",
  },
  get user() {
    return {
      path: extendUrl(this.main.path, "user"),
    };
  },
  get section() {
    return {
      path: extendUrl(this.main.path, "section"),
      get arr() {
        return {
          path: extendUrl(serverRoutes.section.path, "arr"),
        };
      },
    };
  },
  // get tableColumns(){
  //   return extendUrl(this.sectionArr, "/tableColumns")
  // },
};

const prod = {
  name: "Analyzer Client — Production",
  endpoint: "https://ultimate-property-analyzer.herokuapp.com/api",
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
