import urlJoin from "url-join";

function bitRouteAndPath(
  serviceInfo: { bit: string; path: string },
  bit: string
) {
  return {
    bit,
    get route() {
      return urlJoin(serviceInfo.bit, this.bit);
    },
    get path() {
      return urlJoin(serviceInfo.path, this.bit);
    },
  };
}

export function makeCrudConfig(endpoint: string) {
  const apiServiceInfo = {
    bit: "/api",
    get path() {
      return urlJoin(endpoint, this.bit);
    },
  } as const;

  return {
    ...apiServiceInfo,
    userAuthTokenKey: "x-auth-token",
    routes: {
      register: bitRouteAndPath(apiServiceInfo, "/register"),
      login: bitRouteAndPath(apiServiceInfo, "/login"),
      section: {
        ...bitRouteAndPath(apiServiceInfo, "/section"),
        get: {
          paramArr: ["dbStoreName", "dbId"] as const,
        },
        delete: {
          paramArr: ["dbStoreName", "dbId"] as const,
        },
      },
      sectionArr: bitRouteAndPath(apiServiceInfo, "/sectionArr"),
      tableColumns: bitRouteAndPath(apiServiceInfo, "/columns"),
    },
  };
}

export function configUrls(endpoint: string) {
  const urls = {
    app: endpoint,
    api: {
      bit: "/api",
      route: "/api",
      get path() {
        return urlJoin(urls.app, this.bit);
      },
    },
    nextRegister: {
      bit: "/nextRegister",
      get route() {
        return urlJoin(urls.api.route, this.bit);
      },
      get path() {
        return urlJoin(urls.api.path, this.bit);
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
    nextSection: {
      bit: "/nextSection",
      get route() {
        return urlJoin(urls.api.bit, this.bit);
      },
      get path() {
        return urlJoin(urls.api.path, this.bit);
      },
    },
    section: {
      bit: "/section",
      get route() {
        return urlJoin(urls.api.bit, this.bit);
      },
      get path() {
        return urlJoin(urls.api.path, this.bit);
      },
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
