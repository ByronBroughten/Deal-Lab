import { AxiosResponse } from "axios";
import { config } from "../../Constants";
import { Id } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import {
  ApiQueryName,
  NextReq,
  NextRes,
  QueryError,
} from "../../sharedWithServer/apiQueriesShared";
import {
  isLoginHeaders,
  isLoginUserNext,
} from "../../sharedWithServer/apiQueriesShared/Login";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { HandledError } from "../../utils/error";
import https, { handleUnexpectedError } from "../services/httpService";

// server:
// reqValidator

// both:
// pathBit
// pathRoute
// pathFull

type ApiQueries = {
  [QN in ApiQueryName]: ApiQuery<QN>;
};
type ApiQuery<QN extends ApiQueryName> = (
  reqObj: NextReq<QN>
) => Promise<NextRes<QN> | undefined>;

export const apiQueries = makeApiQueries();
function makeApiQueries(): ApiQueries {
  const apiQueryProps: AllApiQueryProps = {
    nextRegister: {
      doingWhat: "registering",
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
        return dbIdResValidator;
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
        config.apiEndpoints[queryName].path,
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

function dbIdResValidator(res: AxiosResponse<unknown>): { data: string } {
  if (Id.is(res.data))
    return {
      data: res.data,
    };
  else throw makeResValidationQueryError();
}

function makeResValidationQueryError() {
  return new QueryError("Response failed validation.");
}
