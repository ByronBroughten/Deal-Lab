import { NextReq } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { GetterVarbs } from "../../sharedWithServer/StateGetters/GetterVarbs";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";
import { LoginSetter } from "./shared/LoginSetter";

interface LoginActorInitProps
  extends StrictOmit<SectionActorBaseProps<"login">, "sectionName"> {}

export class LoginActor extends SectionActorBase<"login"> {
  constructor(props: LoginActorInitProps) {
    super({
      ...props,
      sectionName: "login",
    });
  }
  varb(varbName: string): SetterVarb<"login"> {
    return new SetterVarb({
      ...this.sectionActorBaseProps,
      varbName,
    });
  }
  varbs = new GetterVarbs(this.sectionActorBaseProps);
  loginSetter = new LoginSetter(this.sectionActorBaseProps);
  get loginReq(): NextReq<"nextLogin"> {
    return makeReq(
      this.varbs.values({
        email: "string",
        password: "string",
      })
    );
  }
  async login() {
    const res = await this.apiQueries.nextLogin(this.loginReq);
    this.loginSetter.setLogin(res);
  }
}
