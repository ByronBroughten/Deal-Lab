import { z } from "zod";
import { config } from "../../Constants";
import { SectionPackRaw, zRawSectionPack } from "../SectionPack/SectionPack";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
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
  const test = zLoginFormData.safeParse(value);
  return test.success;
}

export type LoginHeaders = { [config.tokenKey.apiUserAuth]: string };
export function isLoginHeaders(value: any): value is LoginHeaders {
  return (
    typeof value === "object" &&
    typeof value[config.tokenKey.apiUserAuth] === "string"
  );
}
