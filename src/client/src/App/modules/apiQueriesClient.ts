import { AxiosResponse } from "axios";
import {
  ApiQueries,
  apiQueriesShared,
  ApiQuery,
} from "../sharedWithServer/apiQueriesShared";
import { validateSubscriptionValues } from "../sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import {
  ApiQueryName,
  QueryRes,
} from "../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isUserInfoHeaders,
  validateUserData,
} from "../sharedWithServer/apiQueriesShared/getUserData";
import { makeRes } from "../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Obj } from "../sharedWithServer/utils/Obj";
import { StrictOmit } from "../sharedWithServer/utils/types";
import {
  isDbIdData,
  makeResValidationQueryError,
  validateDbArrQueryNameRes,
  validateDbIdRes,
  validateDbSectionPackRes,
  validateSessionUrlRes,
} from "./apiQueriesClient/validateRes";
import { hasAuthHeadersProp } from "./services/authService";
import https from "./services/httpService";

export const apiQueries = makeApiQueries();

function makeApiQueries(): ApiQueries {
  const apiQueryProps: AllApiQueryProps = {
    makeSession: {
      doingWhat: "making a session",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"makeSession"> {
        throw new Error("makeSession.validateRes is not yet properly set up");
      },
    },
    getUserData: {
      doingWhat: "retrieving user data",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"getUserData"> {
        if (
          res &&
          validateUserData(res.data) &&
          isUserInfoHeaders(res.headers)
        ) {
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
    getProPaymentUrl: {
      doingWhat: "going to the pro upgrade payment page",
      validateRes: validateSessionUrlRes,
    },
    getCustomerPortalUrl: {
      doingWhat: "going to your account portal",
      validateRes: validateSessionUrlRes,
    },
    getTableRows: {
      doingWhat: "getting table rows",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"getTableRows"> {
        const { data } = res as QueryRes<"getTableRows">;
        if (Obj.isObjToAny(data)) {
          const { tableRowPacks } = data;
          if (
            tableRowPacks.every((rowPack) => rowPack.sectionName === "tableRow")
          ) {
            return makeRes({ tableRowPacks });
          }
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
  const _test: QueryRes<"getProPaymentUrl"> = await apiQueries.getProPaymentUrl(
    { body: { priceId: "test" } }
  );
}
