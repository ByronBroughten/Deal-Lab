import { config } from "../../Constants";
import { apiQueriesShared } from "../../sharedWithServer/apiQueriesShared";
import { NextRes } from "../../sharedWithServer/apiQueriesSharedTypes";
import { authTokenKey, Res } from "../../sharedWithServer/Crud";
import { crud } from "../crud";
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
  const { analyzer, handleSet } = useAnalyzerContext();
  const setLogin = useSetLogin();

  function trySetLogin(resObj: Res<"Login">) {
    const { data, headers } = resObj;
    auth.setToken(headers[authTokenKey]);
    handleSet("loadSectionArrsAndSolve", data);
  }
  return {
    async login() {
      const resObj = await crud.login.post.send(analyzer.req.login());
      if (resObj) trySetLogin(resObj);
    },
    async register() {
      const resObj = await crud.register.post.send(analyzer.req.register());
      if (resObj) trySetLogin(resObj);
    },
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
