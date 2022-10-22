import { constants } from "../../../Constants";
import { QueryRes } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SetterSectionsBase } from "../../../sharedWithServer/StateSetters/SetterBases/SetterSectionsBase";
import { SetterSections } from "../../../sharedWithServer/StateSetters/SetterSections";
import { auth, UserInfoTokenProp } from "../../services/authService";
import { UserDataSolver } from "./UserDataSolver";

export class UserDataSetter extends SetterSectionsBase {
  get setterSections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }
  setUserInfoToken(headers: UserInfoTokenProp): void {
    auth.setToken(headers[constants.tokenKey.userAuthData]);
  }
  get userDataSolver(): UserDataSolver {
    return new UserDataSolver(this.setterSectionsProps);
  }
  loadUserData({ data, headers }: QueryRes<"getUserData">) {
    this.setUserInfoToken(headers);
    this.userDataSolver.loadUserData(data);
    this.setterSections.setSections();
  }
}
