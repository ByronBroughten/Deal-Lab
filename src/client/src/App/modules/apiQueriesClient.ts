import { AxiosResponse } from "axios";
import {
  ApiQueries,
  apiQueriesShared,
  ApiQuery,
} from "../sharedWithServer/apiQueriesShared";
import {
  ApiQueryName,
  QueryRes,
} from "../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginData,
  isUserInfoHeaders,
} from "../sharedWithServer/apiQueriesShared/login";
import { makeRes } from "../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { validateSubscriptionValues } from "../sharedWithServer/apiQueriesShared/SubscriptionValues";
import { Obj } from "../sharedWithServer/utils/Obj";
import { StrictOmit } from "../sharedWithServer/utils/types";
import {
  isDbIdData,
  makeResValidationQueryError,
  validateDbArrQueryNameRes,
  validateDbIdRes,
  validateDbSectionPackRes,
} from "./apiQueriesClient/validateRes";
import { hasAuthHeadersProp } from "./services/authService";
import https from "./services/httpService";

// these are what I need to replace.
export const apiQueries = makeApiQueries();

function makeApiQueries(): ApiQueries {
  const apiQueryProps: AllApiQueryProps = {
    register: {
      doingWhat: "registering",
      // The only other thing I need is
      // the createReq function
      // And I already have that
      validateRes(res: AxiosResponse<unknown>): QueryRes<"register"> {
        if (res && isLoginData(res.data) && isUserInfoHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else throw makeResValidationQueryError();
      },
    },
    login: {
      doingWhat: "logging in",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"login"> {
        if (res && isLoginData(res.data) && isUserInfoHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else throw makeResValidationQueryError();
      },
    },
    makeSession: {
      doingWhat: "making a session",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"makeSession"> {
        throw new Error("makeSession.validateRes is not yet properly set up");
      },
    },
    getUserData: {
      doingWhat: "retrieving user data",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"login"> {
        if (res && isLoginData(res.data) && isUserInfoHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else throw makeResValidationQueryError();
      },
    },
    getSubscriptionData: {
      doingWhat: "getting user subscription information",
      validateRes(
        res: AxiosResponse<unknown>
      ): QueryRes<"getSubscriptionData"> {
        if (res) {
          const { data, headers } = res;
          if (data && isUserInfoHeaders(headers)) {
            return { data: validateSubscriptionValues(data), headers };
          }
        }
        throw makeResValidationQueryError();
      },
    },
    addSection: {
      doingWhat: "adding a section",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"addSection"> {
        if (res) {
          const { headers, data } = res;
          if (isDbIdData(data) && hasAuthHeadersProp(headers)) {
            return {
              data,
              headers,
            };
          }
        }
        throw makeResValidationQueryError();
      },
    },
    updateSection: {
      doingWhat: "updating a section",
      get validateRes() {
        return validateDbIdRes;
      },
    },
    getSection: {
      doingWhat: "getting a section",
      get validateRes() {
        return validateDbSectionPackRes;
      },
    },
    deleteSection: {
      doingWhat: "deleting a section",
      get validateRes() {
        return validateDbIdRes;
      },
    },
    replaceSectionArr: {
      doingWhat: "replacing sections",
      get validateRes() {
        return validateDbArrQueryNameRes;
      },
    },
    getProPaymentLink: {
      doingWhat: "going to the pro upgrade payment page",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"getProPaymentLink"> {
        const { data } = res as QueryRes<"getProPaymentLink">;
        if (Obj.isObjToAny(data)) {
          const { sessionUrl } = data;
          if (typeof sessionUrl === "string") return makeRes({ sessionUrl });
        }
        throw makeResValidationQueryError();
      },
    },
  } as const;

  return Obj.entries(apiQueryProps).reduce(
    (apiQueries, [queryName, queryProps]) => {
      (apiQueries[queryName] as ApiQuery<ApiQueryName>) = makeApiQuery({
        queryName,
        ...queryProps,
      });
      return apiQueries;
    },
    {} as ApiQueries
  );
}

type AllApiQueryProps = {
  [QN in ApiQueryName]: StrictOmit<MakeApiQueryProps<QN>, "queryName">;
};
interface MakeApiQueryProps<QN extends ApiQueryName> {
  queryName: QN;
  doingWhat: string;
  validateRes: (res: AxiosResponse<unknown>) => QueryRes<QN>;
}
function makeApiQuery<QN extends ApiQueryName>({
  queryName,
  doingWhat,
  validateRes,
}: MakeApiQueryProps<QN>): ApiQuery<QN> {
  return async function apiQuery(req: any) {
    const res = await https.post(
      doingWhat,
      apiQueriesShared[queryName].pathFull,
      req.body
    );
    if (!res) throw makeResValidationQueryError();
    return validateRes(res);
  } as ApiQuery<QN>;
}

async function _testApiQueries() {
  const _test: QueryRes<"getProPaymentLink"> =
    await apiQueries.getProPaymentLink({ body: { priceId: "test" } });
}
