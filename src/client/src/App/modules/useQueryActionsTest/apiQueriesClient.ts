import { AxiosResponse } from "axios";
import {
  ApiQueries,
  apiQueriesShared,
  ApiQuery,
} from "../../sharedWithServer/apiQueriesShared";
import {
  ApiQueryName,
  QueryRes,
} from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginHeaders,
  isLoginUserNext,
} from "../../sharedWithServer/apiQueriesShared/login";
import { makeRes } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import https from "../services/httpService";
import {
  makeResValidationQueryError,
  validateDbIdRes,
  validateDbStoreNameRes,
  validateServerSectionPackRes,
} from "./apiQueriesClient/validateRes";

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
        if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
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
        if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else throw makeResValidationQueryError();
      },
    },
    addSection: {
      doingWhat: "adding a section",
      get validateRes() {
        return validateDbIdRes;
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
        return validateServerSectionPackRes;
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
        return validateDbStoreNameRes;
      },
    },
    upgradeUserToPro: {
      doingWhat: "upgrading to pro",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"upgradeUserToPro"> {
        const { data } = res;
        if (Obj.isAnyIfIsObj(data)) {
          const { success } = data;
          if (success === true) return makeRes({ success });
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
  const _test: QueryRes<"upgradeUserToPro"> = await apiQueries.upgradeUserToPro(
    {
      body: { paymentMethodId: "test" },
    }
  );
}
