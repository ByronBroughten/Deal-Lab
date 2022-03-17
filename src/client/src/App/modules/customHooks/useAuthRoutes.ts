import { authTokenKey, Res } from "../../sharedWithServer/User/crudTypes";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { crud } from "./useStore/useCrud";

export function useAuthRoutes() {
  const { analyzer, handle } = useAnalyzerContext();
  function trySetLogin(resObj: Res<"Login">) {
    const { data, headers } = resObj;
    auth.setToken(headers[authTokenKey]);
    handle("loadSectionArrsAndSolve", data);
  }
  return {
    async login() {
      const resObj = await crud.login(analyzer.req.login());
      if (resObj) trySetLogin(resObj);
    },
    async register() {
      const resObj = await crud.register(analyzer.req.register());
      if (resObj) trySetLogin(resObj);
    },
  };
}
