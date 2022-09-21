import { z } from "zod";
import { constants } from "../../Constants";
import { UserInfoTokenProp } from "../../modules/services/authService";
import {
  SectionPack,
  zRawSectionPack,
} from "../SectionsMeta/childSectionsDerived/SectionPack";
import {
  SectionNameByType,
  sectionNameS,
} from "../SectionsMeta/SectionNameByType";
import { zS } from "../utils/zod";

export type LoginData = {
  [SN in SectionNameByType<"loadOnLogin">]: SectionPack<SN>[];
};

export function isLoginData(value: any): value is LoginData {
  const zLoginUserSchema = makeZLoginUserSchema();
  zLoginUserSchema.parse(value);
  return true;
}

function makeZLoginUserSchema() {
  return z.object(
    sectionNameS.arrs.loadOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zS.array(zRawSectionPack);
      return partial;
    }, {} as Record<keyof LoginData, any>) as Record<keyof LoginData, any>
  );
}

export function isUserInfoHeaders(value: any): value is UserInfoTokenProp {
  return (
    typeof value === "object" &&
    typeof value[constants.tokenKey.apiUserAuth] === "string"
  );
}
