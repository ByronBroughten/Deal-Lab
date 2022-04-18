import Analyzer from "./Analyzer";
import {
  makeDbIdSectionPackReq,
  makeRawSectionPackArrReq,
  makeRawSectionPackReq,
} from "./apiQueriesShared/makeGeneralReqs";
import { ApiQueryName, NextReq } from "./apiQueriesSharedTypes";

// delete apiQueriesShared, and then deal with the
// consequences

export type MakeApiReq = typeof makeApiReq;
export const makeApiReq = {
  // hmm... what happened to the endpoints?
  upgradeUserToPro(paymentMethodId: string): NextReq<"upgradeUserToPro"> {
    return {
      body: {
        paymentMethodId,
      },
    };
  },
  nextRegister(analyzer: Analyzer): NextReq<"nextRegister"> {
    return {
      body: {
        payload: {
          registerFormData: analyzer.section("register").values({
            userName: "string",
            email: "string",
            password: "string",
          }),
          guestAccessSections: analyzer.guestAccessDbSectionPacks(),
        },
      },
    };
  },
  nextLogin(analyzer: Analyzer): NextReq<"nextLogin"> {
    return {
      body: {
        payload: analyzer.section("login").values({
          email: "string",
          password: "string",
        }),
      },
    };
  },
  get addSection() {
    return makeRawSectionPackReq;
  },
  get updateSection() {
    return makeRawSectionPackReq;
  },
  get getSection() {
    return makeDbIdSectionPackReq;
  },
  get deleteSection() {
    return makeDbIdSectionPackReq;
  },
  get replaceSectionArr() {
    return makeRawSectionPackArrReq;
  },
} as const;

type AnalyzerReqGeneral = {
  [QN in ApiQueryName]: (props: any) => NextReq<QN>;
};
type TestAnalyzerReq<T extends AnalyzerReqGeneral> = T;
type _TestAnalyzerReq = TestAnalyzerReq<MakeApiReq>;
