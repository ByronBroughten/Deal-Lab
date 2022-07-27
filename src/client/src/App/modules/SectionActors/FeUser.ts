import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { auth } from "../services/authService";

type FeUserProps = StrictOmit<GetterSectionProps<"user">, "sectionName">;
export class FeUser extends GetterSectionBase<"user"> {
  constructor(props: FeUserProps) {
    super({
      ...props,
      sectionName: "user",
    });
  }
  get get(): GetterSection<"user"> {
    return new GetterSection(this.getterSectionProps);
  }
  get isPro(): boolean {
    const storageAuth = this.get.value("apiStorageAuth", "string");
    return storageAuth === "fullStorage";
  }
  get isLoggedIn() {
    return auth.isToken;
  }
  get isGuest() {
    return !this.isLoggedIn;
  }
}
