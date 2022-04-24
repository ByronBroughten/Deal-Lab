import { AxiosResponse } from "axios";
import { apiQueriesShared } from "../../sharedWithServer/apiQueriesShared";
import {
  ApiQueryName,
  NextReq,
  NextRes,
  QueryError,
} from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginHeaders,
  isLoginUserNext,
} from "../../sharedWithServer/apiQueriesShared/login";
import { makeRes } from "../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { HandledError } from "../../utils/error";
import https, { handleUnexpectedError } from "../services/httpService";
import {
  makeResValidationQueryError,
  validateDbIdRes,
  validateDbStoreNameRes,
  validateServerSectionPackRes,
} from "./apiQueriesClient/validateRes";

type ApiQueries = {
  [QN in ApiQueryName]: ApiQuery<QN>;
};
type ApiQuery<QN extends ApiQueryName> = (
  reqObj: NextReq<QN>
) => Promise<NextRes<QN> | undefined>;

export const apiQueries = makeApiQueries();
function makeApiQueries(): ApiQueries {
  // it would be nice to put the getReq thing here, right?
  // I like using the getReq thing on the
  const apiQueryProps: AllApiQueryProps = {
    nextRegister: {
      doingWhat: "registering",
      // The only other thing I need is
      // the createReq function
      // And I already have that
      validateRes(res: AxiosResponse<unknown>): NextRes<"nextRegister"> {
        if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else throw makeResValidationQueryError();
      },
    },
    nextLogin: {
      doingWhat: "logging in",
      validateRes(res: AxiosResponse<unknown>): NextRes<"nextLogin"> {
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
      validateRes(res: AxiosResponse<unknown>): NextRes<"upgradeUserToPro"> {
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
  validateRes: (res: AxiosResponse<unknown>) => NextRes<QN>;
}
function makeApiQuery<QN extends ApiQueryName>({
  queryName,
  doingWhat,
  validateRes,
}: MakeApiQueryProps<QN>): ApiQuery<QN> {
  return async function apiQuery(reqObj) {
    return await tryApiQuery(async () => {
      const res = await https.post(
        doingWhat,
        apiQueriesShared[queryName].pathFull,
        reqObj.body
      );
      if (!res) throw makeResValidationQueryError();
      return validateRes(res);
    }, doingWhat);
  };
}

async function tryApiQuery<Q extends () => any>(
  query: Q,
  doingWhat: string
): Promise<ReturnType<Q> | undefined> {
  try {
    return query();
  } catch (err) {
    if (err instanceof HandledError) return;
    if (err instanceof QueryError) handleUnexpectedError(err, doingWhat);
    else throw err;
  }
}
