import { z } from "zod";
import { config } from "../../Constants";
import { DbEntry, zDbEntryArr } from "../Analyzer/DbEntry";
import { SectionNam, SectionName } from "../Analyzer/SectionMetas/SectionName";
import { SectionPackRaw, zRawSectionPack } from "../Analyzer/SectionPackRaw";
import { zodSchema } from "../utils/zod";
import { zRegisterFormData } from "./registrator";

export type LoginQueryObjects = {
  req: {
    body: { payload: LoginFormData };
  };
  res: {
    data: LoginUserNext;
    headers: LoginHeaders;
  };
};

export type LoginUser = Omit<
  Record<SectionName<"initOnLogin">, DbEntry[]>,
  "row"
>;

export function isLoginUser(value: any): value is LoginUser {
  const zLoginUserSchema = z.object(
    SectionNam.arrs.fe.initOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zDbEntryArr;
      return partial;
    }, {} as Partial<Record<keyof LoginUser, any>>) as Record<
      keyof LoginUser,
      any
    >
  );
  return zLoginUserSchema.safeParse(value).success;
}

export type LoginUserNext = Omit<
  {
    [SN in SectionName<"initOnLogin">]: SectionPackRaw<"fe", SN>[];
  },
  "row"
>;
export function isLoginUserNext(value: any): value is LoginUserNext {
  const zLoginUserSchema = makeZLoginUserSchema();
  return zLoginUserSchema.safeParse(value).success;
}

function makeZLoginUserSchema() {
  return z.object(
    SectionNam.arrs.fe.initOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zodSchema.array(zRawSectionPack);
      return partial;
    }, {} as Partial<Record<keyof LoginUserNext, any>>) as Record<
      keyof LoginUserNext,
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
