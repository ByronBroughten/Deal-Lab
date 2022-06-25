import { NextReq } from "../apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../apiQueriesShared/makeReqAndRes";
import { sectionNameS } from "../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterVarbs } from "../StateGetters/GetterVarbs";
import { PackMakerSection } from "../StatePackers.ts/PackMakerSection";
import { SolverSections } from "../StateSolvers/SolverSections";
import { StrictOmit } from "../utils/types";
import {
  GuestAccessSectionPackArrs,
  RegisterFormData,
  RegisterReqBody,
} from "./../apiQueriesShared/register";
import { UpdaterSection } from "./../StateUpdaters/UpdaterSection";

export interface RegisterReqMakerProps
  extends StrictOmit<GetterSectionProps<"register">, "sectionName"> {}

export class RegisterReqMaker extends GetterSectionBase<"register"> {
  constructor(props: RegisterReqMakerProps) {
    super({
      ...props,
      sectionName: "register",
    });
  }
  static init(values?: Partial<RegisterFormData>) {
    const sections = SolverSections.initSectionsFromDefaultMain();
    const registerForm = sections.onlyOneRawSection("register");
    const reqMaker = new RegisterReqMaker({
      ...registerForm,
      sectionsShare: { sections },
    });
    if (values) reqMaker.updater.updateValuesDirectly(values);
    return reqMaker;
  }
  get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  private get getterVarbs() {
    return new GetterVarbs(this.getterSectionProps);
  }
  get reqBody(): RegisterReqBody {
    return {
      registerFormData: this.getterVarbs.values({
        userName: "string",
        email: "string",
        password: "string",
      }),
      guestAccessSections: this.guestAccessSectionPacks,
    };
  }
  makeReq(): NextReq<"register"> {
    return makeReq(this.reqBody);
  }
  private get guestAccessSectionPacks(): GuestAccessSectionPackArrs {
    const { getterSectionsProps, main } = this.get.sections;
    const mainPackMaker = new PackMakerSection({
      ...getterSectionsProps,
      ...main.feInfo,
    });
    return mainPackMaker.makeChildSectionPackArrs(
      sectionNameS.arrs.feGuestAccess
    );
  }
}
