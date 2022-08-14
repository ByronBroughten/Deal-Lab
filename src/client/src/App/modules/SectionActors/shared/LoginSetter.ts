import { constants } from "../../../Constants";
import { QueryRes } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SetterSectionsBase } from "../../../sharedWithServer/StateSetters/SetterBases/SetterSectionsBase";
import { SetterSections } from "../../../sharedWithServer/StateSetters/SetterSections";
import { SolverSection } from "../../../sharedWithServer/StateSolvers/SolverSection";
import { auth, UserInfoTokenProp } from "../../services/authService";

export class LoginSetter extends SetterSectionsBase {
  get setterSections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }
  setUserInfoToken(headers: UserInfoTokenProp): void {
    auth.setToken(headers[constants.tokenKey.apiUserAuth]);
  }
  setLogin({ data, headers }: QueryRes<"getUserData">) {
    this.setUserInfoToken(headers);
    const feStore = this.setterSections.oneAndOnly("feStore");
    const solverStore = SolverSection.init(feStore.get.getterSectionProps);
    solverStore.loadSelfSectionPackAndSolve(data.feStore[0]);
    const authInfo = solverStore.onlyChild("authInfo");
    authInfo.varb("authStatus").directUpdateAndSolve("user");
    this.setterSections.setSections();
  }
}
