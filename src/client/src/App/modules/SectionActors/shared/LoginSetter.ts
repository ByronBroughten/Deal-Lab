import { constants } from "../../../Constants";
import { NextRes } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SetterSectionsBase } from "../../../sharedWithServer/StateSetters/SetterBases/SetterSectionsBase";
import { SetterSections } from "../../../sharedWithServer/StateSetters/SetterSections";
import { auth } from "../../services/authService";

export class LoginSetter extends SetterSectionsBase {
  setterSections = new SetterSections(this.setterSectionsProps);
  setLogin({ data, headers }: NextRes<"nextLogin">) {
    auth.setToken(headers[constants.tokenKey.apiUserAuth]);
    const { main } = this.setterSections;
    main.loadChildPackArrs(data);
  }
}
