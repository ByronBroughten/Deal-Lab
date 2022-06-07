import { NextReq } from "../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { SectionPackArrs } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { sectionNameS } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { GetterVarbs } from "../../sharedWithServer/StateGetters/GetterVarbs";
import {
  SetterSectionBase,
  SetterSectionProps,
} from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { apiQueries } from "../useQueryActions/apiQueriesClient";
import { SectionPackMaker } from "./../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { LoginSetter } from "./shared/LoginSetter";

interface RegisterActorInitProps
  extends StrictOmit<SetterSectionProps<"register">, "sectionName"> {}
export class RegisterActor extends SetterSectionBase<"register"> {
  constructor(props: RegisterActorInitProps) {
    super({
      ...props,
      sectionName: "register",
    });
  }
  private get getterVarbs() {
    return new GetterVarbs(this.setterSectionProps);
  }
  private get getterSections() {
    return new GetterSections(this.setterSectionsProps);
  }
  private get loginSetter(): LoginSetter {
    return new LoginSetter(this.setterSectionsProps);
  }

  get registerReq(): NextReq<"nextRegister"> {
    return makeReq({
      registerFormData: this.getterVarbs.values({
        userName: "string",
        email: "string",
        password: "string",
      }),
      guestAccessSections: this.guestAccessSectionPacks,
    });
  }
  async register(): Promise<void> {
    const res = await apiQueries.nextRegister(this.registerReq);
    this.loginSetter.setLogin(res);
  }
  private get guestAccessSectionPacks(): SectionPackArrs<"feGuestAccess"> {
    const { getterSectionsProps, main } = this.getterSections;
    const mainPackMaker = new SectionPackMaker({
      ...getterSectionsProps,
      ...main.feInfo,
    });
    return mainPackMaker.makeChildSectionPackArrs(
      sectionNameS.arrs.feGuestAccess
    );
  }
}
