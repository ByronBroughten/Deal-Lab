import { config } from "../../Constants";
import { apiQueriesShared } from "../../sharedWithServer/apiQueriesShared";
import { NextRes } from "../../sharedWithServer/apiQueriesSharedTypes";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { apiQueries } from "./apiQueriesClient";

function useSetLogin() {
  const { handleSet } = useAnalyzerContext();
  return (resObj: NextRes<"nextLogin">) => {
    const { data, headers } = resObj;
    auth.setToken(headers[config.tokenKey.apiUserAuth]);
    handleSet("loadUserAndSolve", data);
  };
}

export function useAuthQueryActions() {
  const { analyzer } = useAnalyzerContext();
  const setLogin = useSetLogin();
  return {
    async nextLogin() {
      const reqObj = apiQueriesShared.nextLogin.makeReq(analyzer);
      const resObj = await apiQueries.nextLogin(reqObj);
      if (resObj) setLogin(resObj);
    },
    async nextRegister() {
      const reqObj = apiQueriesShared.nextRegister.makeReq(analyzer);
      const resObj = await apiQueries.nextRegister(reqObj);
      if (resObj) setLogin(resObj);
    },
  };
}
