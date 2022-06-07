import { NextReq } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { GetterVarbs } from "../../sharedWithServer/StateGetters/GetterVarbs";
import {
  SetterSectionBase,
  SetterSectionProps,
} from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { apiQueries } from "../useQueryActions/apiQueriesClient";
import { LoginSetter } from "./shared/LoginSetter";

interface LoginActorInitProps
  extends StrictOmit<SetterSectionProps<"login">, "sectionName"> {}

export class LoginActor extends SetterSectionBase<"login"> {
  constructor(props: LoginActorInitProps) {
    super({
      ...props,
      sectionName: "login",
    });
  }
  varbs = new GetterVarbs(this.setterSectionProps);
  loginSetter = new LoginSetter(this.setterSectionsProps);
  get loginReq(): NextReq<"nextLogin"> {
    return makeReq(
      this.varbs.values({
        email: "string",
        password: "string",
      })
    );
  }
  async login() {
    const res = await apiQueries.nextLogin(this.loginReq);
    this.loginSetter.setLogin(res);
  }
}
