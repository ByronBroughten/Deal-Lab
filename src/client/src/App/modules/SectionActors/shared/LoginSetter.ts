import { constants } from "../../../Constants";
import { QueryRes } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SetterSectionsBase } from "../../../sharedWithServer/StateSetters/SetterBases/SetterSectionsBase";
import { SetterSections } from "../../../sharedWithServer/StateSetters/SetterSections";
import { auth, UserInfoTokenProp } from "../../services/authService";
import { LoginSolver } from "./LoginSolver";

export class LoginSetter extends SetterSectionsBase {
  get setterSections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }
  setUserInfoToken(headers: UserInfoTokenProp): void {
    auth.setToken(headers[constants.tokenKey.apiUserAuth]);
  }
  get loginSolver(): LoginSolver {
    return new LoginSolver(this.setterSectionsProps);
  }
  setLogin({ data, headers }: QueryRes<"getUserData">) {
    this.setUserInfoToken(headers);
    this.loginSolver.setLogin(data.feUser[0]);
    this.setterSections.setSections();
  }
}
