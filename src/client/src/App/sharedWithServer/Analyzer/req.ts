import { Req } from "../User/crudTypes";
import Analyzer from "./../Analyzer";

export type AnalyzerReq = typeof analyzerReq;
export const analyzerReq = {
  register(analyzer: Analyzer): Req<"Register"> {
    return {
      body: {
        payload: {
          registerFormData: analyzer.section("register").values({
            userName: "string",
            email: "string",
            password: "string",
          }),
          guestAccessSections: analyzer.dbEntryArrs("feGuestAccessStore"),
        },
      },
    };
  },
  login(analyzer: Analyzer): Req<"Login"> {
    return {
      body: {
        payload: analyzer.section("login").values({
          email: "string",
          password: "string",
        }),
      },
    };
  },
} as const;
