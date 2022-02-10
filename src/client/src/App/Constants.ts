import urlJoin from "url-join";

const dev = {
  name: "Analyzer Client — Development",
  appUrl: "http://localhost:5000"
};

const test = urlJoin("a", "b");
console.log("url-join test", test);

const prod = {
  name: "Analyzer Client — Production",
  appUrl: "https://ultimate-property-analyzer.herokuapp.com",
};

const constants = process.env.NODE_ENV === "development" ? dev : prod;

export const urls = {
  app: constants.appUrl,
  api: {
    bit: "/api",
    get path() {
      return urlJoin(urls.app, this.bit) ;
    }
  },
  // user
  user: {
    bit: "/user",
    get route()  {
      return urlJoin(urls.api.bit, this.bit)
    },
    get path() {
      return urlJoin(urls.api.path, this.bit)
    }
  },
  login: {
    bit: "/login",
    get path() {
      return urlJoin(urls.user.path, this.bit)
    }
  },
  register: {
    bit: "/register",
    get path() {
      return urlJoin(urls.user.path, this.bit)
    }
  },
  // section
  section: {
    bit: "/section",
    get route() {
      return urlJoin(urls.api.bit, this.bit)
    },
    get path() {
      return urlJoin(urls.api.path, this.bit)
    },
    get: "/:dbStoreName/:dbId",
    delete: "/:dbStoreName/:dbId",
  },
  sectionArr: {
    bit: "/arr",
    get path() {
      return urlJoin(urls.section.path, this.bit)
    }
  },
  tableColumns: {
    bit: "/columns",
    get route() {
      return urlJoin(urls.sectionArr.bit, this.bit)
    },
    get path() {
      return urlJoin(urls.sectionArr.path, this.bit)
    }
  },
} as const
