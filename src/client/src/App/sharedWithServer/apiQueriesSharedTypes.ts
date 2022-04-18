import { config } from "../Constants";
import { LoginQueryObjects } from "./apiQueriesShared/login";
import {
  DbIdRes,
  DbSectionPackInfoReq,
  DbStoreNameRes,
  SectionPackArrReq,
  SectionPackReq,
  SectionPackRes,
} from "./apiQueriesShared/makeGeneralReqs";
import { RegisterQueryObjects } from "./apiQueriesShared/register";

export type ApiQueryName = keyof ApiHttpObjects;
export type NextReq<R extends keyof ApiHttpObjects> = ApiHttpObjects[R]["req"];
export type NextRes<R extends keyof ApiHttpObjects> = ApiHttpObjects[R]["res"];
export class QueryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type ApiHttpObjects = {
  nextRegister: RegisterQueryObjects;
  nextLogin: LoginQueryObjects;
  addSection: {
    req: SectionPackReq;
    res: DbIdRes;
  };
  updateSection: {
    req: SectionPackReq;
    res: DbIdRes;
  };
  getSection: {
    req: DbSectionPackInfoReq;
    res: SectionPackRes;
  };
  deleteSection: {
    req: DbSectionPackInfoReq;
    res: DbIdRes;
  };
  replaceSectionArr: {
    req: SectionPackArrReq;
    res: DbStoreNameRes;
  };
  upgradeUserToPro: {
    req: {
      body: {
        paymentMethodId: string;
      };
    };
    res: {
      data: {
        success: boolean;
      };
    };
  };
};

type ApiHttpObjectsGeneral = {
  [QN in typeof config.apiQueryNames[number]]: {
    req: {
      body: any;
    };
    res: {
      data: any;
    };
  };
};
type CheckApiHttpObjects<T extends ApiHttpObjectsGeneral> = T;
type _ApiHttpObjectsTest = CheckApiHttpObjects<ApiHttpObjects>;
