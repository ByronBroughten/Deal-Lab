import { authTokenKey, Res } from "../../sharedWithServer/User/crudTypes";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { crud } from "../crud";

export function useAuthRoutes() {
  const { analyzer, handleSet } = useAnalyzerContext();
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
  };
}
