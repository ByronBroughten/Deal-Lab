import { NextReq } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { RegisterReqMaker } from "../../sharedWithServer/ReqMakers/RegisterReqMaker";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";
import { LoginSetter } from "./shared/LoginSetter";

interface RegisterActorInitProps
  extends StrictOmit<SectionActorBaseProps<"register">, "sectionName"> {}
export class RegisterActor extends SectionActorBase<"register"> {
  constructor(props: RegisterActorInitProps) {
    super({
      ...props,
      sectionName: "register",
    });
  }
  private get reqMaker() {
    return new RegisterReqMaker(this.sectionActorBaseProps);
  }
  private get loginSetter(): LoginSetter {
    return new LoginSetter(this.sectionActorBaseProps);
  }
  varb(varbName: string): SetterVarb<"register"> {
    return new SetterVarb({
      ...this.sectionActorBaseProps,
      varbName,
    });
  }
  get registerReq(): NextReq<"register"> {
    return this.reqMaker.makeReq();
  }
  get section() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  async register(): Promise<void> {
    const res = await this.apiQueries.register(this.registerReq);
    this.loginSetter.setLogin(res);
    this.section.resetToDefault();
  }
}
