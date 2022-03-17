import { AxiosResponse } from "axios";
import { config } from "../Constants";
import {
  is,
  isLoginHeaders,
  Req,
  Res,
} from "../sharedWithServer/User/crudTypes";
import https from "./services/httpService";
import { DbStoreName } from "../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { DbEntry } from "../sharedWithServer/Analyzer/DbEntry";
import {
  SectionNam,
  SectionName,
} from "../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { LoginUser, zDbEntryArr } from "../sharedWithServer/User/DbUser";
import { z } from "zod";

const url = {
  section: config.url.section.path,
  sectionArr: config.url.sectionArr.path,
  dbColArr: config.url.tableColumns.path,
};

export function isLoginUser(value: any): value is LoginUser {
  const zLoginUserSchema = z.object(
    SectionNam.arr.initOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zDbEntryArr;
      return partial;
    }, {} as Partial<Record<keyof LoginUser, any>>) as Record<
      keyof LoginUser,
      any
    >
  );
  return zLoginUserSchema.safeParse(value).success;
}

const validateRes = {
  dbId(res: AxiosResponse<unknown> | undefined): { data: string } | undefined {
    if (res && is.dbId(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
  dbEntry(
    res: AxiosResponse<unknown> | undefined
  ): { data: DbEntry } | undefined {
    if (res && is.dbEntry(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
  dbEntryArr(
    res: AxiosResponse<unknown> | undefined
  ): Res<"PostTableColumns"> | undefined {
    if (res && is.dbEntryArr(res.data)) {
      return {
        data: res.data,
      };
    } else return undefined;
  },
};

const generalValidators = {
  dbId(res: AxiosResponse<unknown> | undefined): { data: string } | undefined {
    if (res && is.dbId(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
};

export const crud = {
  login: {
    validateRes(
      res: AxiosResponse<unknown> | undefined
    ): Res<"Login"> | undefined {
      if (res && isLoginUser(res.data) && isLoginHeaders(res.headers)) {
        return {
          data: res.data,
          headers: res.headers,
        };
      } else return undefined;
    },
    async send(reqObj: Req<"Login">): Promise<Res<"Login"> | undefined> {
      const res = await https.post(
        "logging in",
        config.url.login.path,
        reqObj.body
      );
      return this.validateRes(res);
    },
  },
  register: {
    get validateRes() {
      return crud.login.validateRes;
    },
    async send(reqObj: Req<"Register">): Promise<Res<"Register"> | undefined> {
      const res = await https.post(
        "registering",
        config.url.register.path,
        reqObj.body
      );
      return this.validateRes(res);
    },
  },
  postSection: {
    get validateRes() {
      return generalValidators.dbId;
    },
    async send(
      reqObj: Req<"PostEntry">
    ): Promise<Res<"PostEntry"> | undefined> {
      const res = await https.post(`saving`, url.section, reqObj.body);
      return this.validateRes(res);
    },
  },
  postSectionArr: {
    get validateRes() {
      return generalValidators.dbId;
    },
    async send(
      reqObj: Req<"PostSectionArr">
    ): Promise<Res<"PostSectionArr"> | undefined> {
      const res = await https.post("saving", url.sectionArr, reqObj.body);
      return this.validateRes(res);
    },
  },
  async postTableColumns(
    dbEntryArr: DbEntry[],
    dbStoreName: SectionName<"table">
  ) {
    const reqObj: Req<"PostTableColumns"> = {
      body: {
        payload: dbEntryArr,
        dbStoreName,
      },
    };
    const res = await https.post("saving", url.dbColArr, reqObj.body);
    return validateRes.dbEntryArr(res);
  },
  async putEntry(
    dbEntry: DbEntry,
    dbStoreName: DbStoreName
  ): Promise<Res<"PutEntry"> | undefined> {
    const reqObj: Req<"PutEntry"> = {
      body: {
        payload: dbEntry,
        dbStoreName,
      },
    };
    const res = await https.put("updating", url.section, reqObj.body);
    return validateRes.dbId(res);
  },
  async getEntry(
    dbStoreName: DbStoreName,
    dbId: string
  ): Promise<Res<"GetEntry"> | undefined> {
    const reqObj: Req<"GetEntry"> = {
      params: {
        dbStoreName,
        dbId,
      },
    };
    const res = await https.get(`loading from ${dbStoreName}`, url.section, [
      ...Object.values(reqObj.params),
    ]);
    return validateRes.dbEntry(res);
  },
  async deleteEntry(
    dbId: string,
    dbStoreName: DbStoreName
  ): Promise<Res<"DeleteEntry"> | undefined> {
    const reqObj: Req<"DeleteEntry"> = {
      params: {
        dbStoreName,
        dbId,
      },
    };
    const res = await https.delete(
      `deleting from ${dbStoreName}`,
      url.section,
      [...Object.values(reqObj.params)]
    );
    return validateRes.dbId(res);
  },
} as const;
