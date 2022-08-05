import { constants } from "../../../Constants";
import { QueryRes } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SetterSectionsBase } from "../../../sharedWithServer/StateSetters/SetterBases/SetterSectionsBase";
import { SetterSections } from "../../../sharedWithServer/StateSetters/SetterSections";
import { SolverSection } from "../../../sharedWithServer/StateSolvers/SolverSection";
import { auth } from "../../services/authService";

export class LoginSetter extends SetterSectionsBase {
  get setterSections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }

  setLogin({ data, headers }: QueryRes<"getUserData">) {
    auth.setToken(headers[constants.tokenKey.apiUserAuth]);

    const feStore = this.setterSections.oneAndOnly("feStore");
    const solverStore = SolverSection.init(feStore.get.getterSectionProps);
    solverStore.loadSelfSectionPackAndSolve(data.feStore[0]);
    const authInfo = solverStore.onlyChild("authInfo");
    authInfo.varb("authStatus").directUpdateAndSolve("user");
    this.setterSections.setSections();
  }
}