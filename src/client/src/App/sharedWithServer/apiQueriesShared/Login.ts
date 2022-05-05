import { z } from "zod";
import { config } from "../../Constants";
import { SectionPackRaw, zRawSectionPack } from "../Analyzer/SectionPackRaw";
import { SectionName, sectionNameS } from "../SectionMetas/SectionName";
import { zodSchema } from "../utils/zod";
import { zRegisterFormData } from "./register";

export type LoginQueryObjects = {
  req: {
    body: LoginFormData;
  };
  res: {
    data: LoginUser;
    headers: LoginHeaders;
  };
};

export type LoginUser = {
  [SN in SectionName<"loadOnLogin">]: SectionPackRaw<SN>[];
};
export function isLoginUserNext(value: any): value is LoginUser {
  // Wait, why am I doing that?
  // I guess to access the user varbs.
  // I would like to just get this working, though.
  // I know that it's rather dangerous not to.
  const zLoginUserSchema = makeZLoginUserSchema();
  zLoginUserSchema.parse(value);
  return true;
}

function makeZLoginUserSchema() {
  return z.object(
    sectionNameS.arrs.loadOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zodSchema.array(zRawSectionPack);
      return partial;
    }, {} as Partial<Record<keyof LoginUser, any>>) as Record<
      keyof LoginUser,
      any
    >
  );
}

// eventually replace this interface with one derived from baseSections
const zLoginFormData = zRegisterFormData.pick({
  email: true,
  password: true,
});
export type LoginFormData = z.infer<typeof zLoginFormData>;

export function isLoginFormData(value: any): value is LoginFormData {
  return zLoginFormData.safeParse(value).success;
}

export type LoginHeaders = { [config.tokenKey.apiUserAuth]: string };
export function isLoginHeaders(value: any): value is LoginHeaders {
  return (
    typeof value === "object" &&
    typeof value[config.tokenKey.apiUserAuth] === "string"
  );
}
