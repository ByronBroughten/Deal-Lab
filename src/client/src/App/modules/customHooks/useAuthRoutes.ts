import { AxiosResponse } from "axios";
import { config } from "../../Constants";
import {
  authTokenKey,
  isLoginHeaders,
  Res,
} from "../../sharedWithServer/User/crudTypes";
import { isLoginUser } from "../../sharedWithServer/User/DbUser";
import { auth } from "../services/authService";
import https from "../services/httpService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";

const validate = {
  loginRes(res: AxiosResponse<unknown> | undefined): Res<"Login"> | undefined {
    if (res && isLoginUser(res.data) && isLoginHeaders(res.headers)) {
      return {
        data: res.data,
        headers: res.headers,
      };
    } else return undefined;
  },
};

export function useAuthRoutes() {
  const { analyzer, handle } = useAnalyzerContext();
  function trySetLogin(res: AxiosResponse<unknown> | undefined) {
    const reqObj = validate.loginRes(res);
    if (!reqObj) return;
    const { data, headers } = reqObj;
    auth.setToken(headers[authTokenKey]);
    handle("loadSectionArrsAndSolve", data);
  }
  return {
    async login() {
      const reqObj = analyzer.req.login();
      const res = await https.post(
        "logging in",
        config.url.login.path,
        reqObj.body
      );
      trySetLogin(res);
    },
    async register() {
      const reqObj = analyzer.req.register();
      const res = await https.post(
        "registering",
        config.url.register.path,
        reqObj.body
      );
      trySetLogin(res);
    },
  };
}
