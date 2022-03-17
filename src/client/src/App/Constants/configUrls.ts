import urlJoin from "url-join";

export function configUrls(endpoint: string) {
  const urls = {
    app: endpoint,
    api: {
      bit: "/api",
      get path() {
        return urlJoin(urls.app, this.bit);
      },
    },
    // user
    user: {
      bit: "/user",
      get route() {
        return urlJoin(urls.api.bit, this.bit);
      },
      get path() {
        return urlJoin(urls.api.path, this.bit);
      },
    },
    login: {
      bit: "/login",
      get route() {
        return urlJoin(urls.user.route, this.bit);
      },
      get path() {
        return urlJoin(urls.user.path, this.bit);
      },
    },
    register: {
      bit: "/register",
      get route() {
        return urlJoin(urls.user.route, this.bit);
      },
      get path() {
        return urlJoin(urls.user.path, this.bit);
      },
    },
    // section
    section: {
      bit: "/section",
      get route() {
        return urlJoin(urls.api.bit, this.bit);
      },
      get path() {
        return urlJoin(urls.api.path, this.bit);
      },
      // alright, here's what I can do.
      // put param names in a list form on the config url, such as for get.
      // create the params string out of that.
      // create a generic type that takes such an array of strings,
      // and that takes and produces something that extends Record<paramName, string>
      // for when that record is gotten in the client crud get method, create a function
      // that loops through the params object using the config paramNames to make an
      // arr of the params in the right order. Join them, then bam.
      // the type, the string, and the order of the params are all then constrained
      // by the config params
      params: {
        get: ["dbStoreName", "dbId"] as const,
        delete: ["dbStoreName", "dbId"] as const,
      },

      get: "/:dbStoreName/:dbId",
      delete: "/:dbStoreName/:dbId",
    },
    sectionArr: {
      bit: "/all",
      get route() {
        return urlJoin(urls.section.route, this.bit);
      },
      get path() {
        return urlJoin(urls.section.path, this.bit);
      },
    },
    tableColumns: {
      bit: "/columns",
      get route() {
        return urlJoin(urls.sectionArr.bit, this.bit);
      },
      get path() {
        return urlJoin(urls.sectionArr.path, this.bit);
      },
    },
  } as const;
  return urls;
}

// depreciated urls
// url: {
//   bit: {
//     user: "/api/user",
//     dbEntry: "/api/dbEntry",
//   },
//   get api() {
//     return {
//       main: constants.endpoint,
//       user: urlJoin(constants.endpoint, this.bit.user),
//       dbEntry: urlJoin(constants.endpoint, this.bit.dbEntry),
//       get sectionArr() {
//         return urlJoin(this.dbEntry, "all/");
//       },
//       get tableColumns() {
//         return urlJoin(this.sectionArr, "columns/");
//       },
//     };
//   },
// },
