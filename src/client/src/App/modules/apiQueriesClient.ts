import { AxiosResponse } from "axios";
import {
  ApiQueries,
  ApiQuery,
  QueryRes,
} from "../../sharedWithServer/ApiQueries";
import { validateSubscriptionValues } from "../../sharedWithServer/apiQueriesShared/EstimatorPlanValues";
import { constant, constants } from "../../sharedWithServer/Constants";
import { ApiQueryName } from "../../sharedWithServer/Constants/queryPaths";
import { validateSectionPackArrByType } from "../../sharedWithServer/SectionNameByType";
import {
  SectionPack,
  validateSectionPack,
} from "../../sharedWithServer/StateTransports/SectionPack";
import { validateUserData } from "../../sharedWithServer/StateTransports/UserData";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import {
  validateAxiosRes,
  validateDbIdData,
  validateDbIdRes,
  validateDbSectionPackRes,
  validateSessionUrlRes,
} from "./apiQueriesClient/validateRes";
import https from "./services/httpService";
import { userTokenS } from "./services/userTokenS";

export const apiQueries = makeApiQueries();

function makeApiQueries(): ApiQueries {
  const apiQueryProps: AllApiQueryProps = {
    makeSession: {
      doingWhat: "making a session",
      validateRes(_: AxiosResponse<unknown>): QueryRes<"makeSession"> {
        throw new Error("makeSession.validateRes is not yet properly set up");
      },
    },
    getArchivedDeals: {
      doingWhat: "retrieving archived deals",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"getArchivedDeals"> {
        return {
          data: validateSectionPackArrByType({
            value: res.data,
            sectionType: "deal",
          }) as SectionPack<"deal">[],
        };
      },
    },
    getNewDeal: {
      doingWhat: `creating a new ${constants.appUnit.toLowerCase()}`,
      validateRes(res: AxiosResponse<unknown>): QueryRes<"getNewDeal"> {
        return { data: validateSectionPack(res.data, "deal") };
      },
    },
    getUserData: {
      doingWhat: "retrieving user data",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"getUserData"> {
        return {
          data: validateUserData(res.data),
          headers: userTokenS.validateHasUserTokenProp(res.headers),
        };
      },
    },
    getSubscriptionData: {
      doingWhat: "getting user subscription information",
      validateRes(
        res: AxiosResponse<unknown>
      ): QueryRes<"getSubscriptionData"> {
        return {
          data: validateSubscriptionValues(res.data),
          headers: userTokenS.validateHasUserTokenProp(res.headers),
        };
      },
    },
    addSection: {
      doingWhat: "adding a section",
      validateRes(res: AxiosResponse<unknown>): QueryRes<"addSection"> {
        return {
          data: validateDbIdData(res.data),
          headers: userTokenS.validateHasUserTokenProp(res.headers),
        };
      },
    },
    updateSection: {
      doingWhat: "updating a section",
      get validateRes() {
        return validateDbIdRes;
      },
    },
    updateSections: {
      doingWhat: "updating saved sections",
      get validateRes() {
        return validateAxiosRes;
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
    replaceSectionArrs: {
      doingWhat: "replacing sections",
      get validateRes() {
        return validateAxiosRes;
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
  } as const;

  return Obj.keys(apiQueryProps).reduce((queries, queryName) => {
    (queries[queryName] as ApiQuery<ApiQueryName>) = makeApiQuery({
      queryName,
      ...apiQueryProps[queryName],
    });
    return queries;
  }, {} as ApiQueries);
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
      constant("pathFull")[queryName],
      req.body
    );

    if (!res) {
      throw new Error("The response is undefined.");
    }
    return validateRes(res);
  } as ApiQuery<QN>;
}

async function _testApiQueries() {
  const _test: QueryRes<"getProPaymentUrl"> = await apiQueries.getProPaymentUrl(
    { body: { priceId: "test" } }
  );
}
