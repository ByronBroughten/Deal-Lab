import { AxiosResponse } from "axios";
import { config } from "../../Constants";
import { SectionNam } from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import {
  authTokenKey,
  isLoginHeaders,
  LoginFormData,
  RegisterFormData,
  Req,
  Res,
} from "../../sharedWithServer/User/crudTypes";
import { isLoginUser } from "../../sharedWithServer/User/DbUser";
import { extendUrl } from "../../utils/url";
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
    async login(loginFormData: LoginFormData) {
      const url = extendUrl(config.url.api.user, "login");
      const reqObj: Req<"Login"> = {
        body: { payload: loginFormData },
      };
      const res = await https.post("logging in", url, reqObj.body);
      trySetLogin(res);
    },
    async register(registerFormData: RegisterFormData) {
      const url = extendUrl(config.url.api.user, "/register");
      const reqObj: Req<"Register"> = {
        body: {
          payload: {
            registerFormData,
            guestAccessSections: analyzer.sectionArrsToDbEntries(
              SectionNam.arr.feGuestAccessStore
            ),
          },
        },
      };
      const res = await https.post("registering", url, reqObj.body);
      trySetLogin(res);
    },
  };
}
