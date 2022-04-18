import { config } from "../../Constants";
import { NextReq, NextRes } from "../../sharedWithServer/apiQueriesSharedTypes";
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

function useMakeAuthReq() {
  const { analyzer } = useAnalyzerContext();
  return {
    nextRegister(): NextReq<"nextRegister"> {
      return analyzer.req.nextRegister();
    },
    nextLogin(): NextReq<"nextLogin"> {
      return analyzer.req.nextLogin();
    },
  };
}

export function useAuthQueryActions() {
  const { analyzer, handleSet } = useAnalyzerContext();
  const setLogin = useSetLogin();
  const makeAuthReq = useMakeAuthReq();

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
      const resObj = await apiQueries.nextLogin(makeAuthReq.nextLogin());
      if (resObj) setLogin(resObj);
    },
    async nextRegister() {
      const resObj = await apiQueries.nextRegister(makeAuthReq.nextRegister());
      if (resObj) setLogin(resObj);
    },
  };
}
