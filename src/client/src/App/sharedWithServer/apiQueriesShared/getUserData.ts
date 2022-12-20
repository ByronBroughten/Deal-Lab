import { z } from "zod";
import { constants } from "../../Constants";
import { UserInfoTokenProp } from "../../modules/services/authService";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../SectionsMeta/relSectionsDerived/FeStoreName";
import { ChildSectionPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import {
  SectionPack,
  zRawSectionPack,
} from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackByType } from "../SectionsMeta/SectionNameByType";
import { zS } from "../utils/zod";

export type UserData = {
  feUser: SectionPack<"feUser">;
  mainStoreArrs: MainStoreArrs;
};
export function validateUserData(value: any): value is UserData {
  const { feUser, mainStoreArrs } = value as UserData;
  validateSectionPackByType(feUser, "feUser");
  validateMainStoreArrs(mainStoreArrs);
  return true;
}

function validateMainStoreArrs(value: any): void {
  const schema = z.object(
    feStoreNameS.arrs.mainStoreName.reduce((partial, sectionName) => {
      partial[sectionName] = zS.array(zRawSectionPack);
      return partial;
    }, {} as Record<keyof MainStoreArrs, any>) as Record<
      keyof MainStoreArrs,
      any
    >
  );
  schema.parse(value);
}

export type MainStoreArrs = {
  [CN in FeStoreNameByType<"mainStoreName">]: ChildSectionPack<"feUser", CN>[];
};

export function isUserInfoHeaders(value: any): value is UserInfoTokenProp {
  return (
    typeof value === "object" &&
    typeof value[constants.tokenKey.userAuthData] === "string"
  );
}
