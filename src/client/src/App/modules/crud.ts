import { AxiosResponse } from "axios";
import { config } from "../Constants";
import { DbEntry } from "../sharedWithServer/Analyzer/DbEntry";
import { SectionName } from "../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { NextReq, NextRes } from "../sharedWithServer/apiQueriesShared";
import {
  isLoginHeaders,
  isLoginUser,
  isLoginUserNext,
} from "../sharedWithServer/apiQueriesShared/login";
import { is, Req, Res } from "../sharedWithServer/Crud";
import { urlPlusParams } from "../utils/url";
import https from "./services/httpService";

const url = {
  section: config.url.section.path,
  sectionArr: config.url.sectionArr.path,
  dbColArr: config.url.tableColumns.path,
};

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
  dbEntry(
    res: AxiosResponse<unknown> | undefined
  ): { data: DbEntry } | undefined {
    if (res && is.dbEntry(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
};

// I like the way serverCrud is organized for the serverside
// do I want to organize clientCrud like that, too?
export const crud = {
  login: {
    post: {
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
  },
  nextLogin: {
    post: {
      async send(
        reqObj: NextReq<"nextLogin">
      ): Promise<NextRes<"nextLogin"> | undefined> {
        const res = await https.post(
          "logging in",
          config.url.login.path,
          reqObj.body
        );
        return this.validateRes(res);
      },
      validateRes(
        res: AxiosResponse<unknown> | undefined
      ): NextRes<"nextLogin"> | undefined {
        if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else return undefined;
      },
    },
  },
  nextRegister: {
    post: {
      async send(
        reqObj: NextReq<"nextRegister">
      ): Promise<NextRes<"nextRegister"> | undefined> {
        const res = await https.post(
          "registering",
          config.apiEndpoints.nextRegister.path,
          reqObj.body
        );
        return this.validateRes(res);
      },
      validateRes(
        res: AxiosResponse<unknown> | undefined
      ): NextRes<"nextRegister"> | undefined {
        if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
          return {
            data: res.data,
            headers: res.headers,
          };
        } else return undefined;
      },
    },
  },

  register: {
    post: {
      get validateRes() {
        return crud.login.post.validateRes;
      },
      async send(
        reqObj: Req<"Register">
      ): Promise<Res<"Register"> | undefined> {
        const res = await https.post(
          "registering",
          config.url.register.path,
          reqObj.body
        );
        return this.validateRes(res);
      },
    },
  },
  section: {
    path: config.url.section.path,
    post: {
      get validateRes() {
        return generalValidators.dbId;
      },
      async send(
        reqObj: Req<"PostEntry">
      ): Promise<Res<"PostEntry"> | undefined> {
        const res = await https.post(`saving`, crud.section.path, reqObj.body);
        return this.validateRes(res);
      },
    },
    put: {
      get validateRes() {
        return generalValidators.dbId;
      },
      async send(
        reqObj: Req<"PutSection">
      ): Promise<Res<"PutSection"> | undefined> {
        const res = await https.put("updating", url.section, reqObj.body);
        return this.validateRes(res);
      },
    },
    get: {
      get validateRes() {
        return generalValidators.dbEntry;
      },
      async send({
        params,
      }: Req<"GetSection">): Promise<Res<"GetSection"> | undefined> {
        const res = await https.get(
          `loading from ${params.dbStoreName}`,
          urlPlusParams(url.section, params, config.url.section.params.get)
        );
        return this.validateRes(res);
      },
    },
    delete: {
      get validateRes() {
        return generalValidators.dbId;
      },
      async send({
        params,
      }: Req<"DeleteSection">): Promise<Res<"DeleteSection"> | undefined> {
        const res = await https.delete(
          `deleting from ${params.dbStoreName}`,
          urlPlusParams(url.section, params, config.url.section.params.get)
        );
        return this.validateRes(res);
      },
    },
  },
  sectionArr: {
    path: config.url.sectionArr.path,
    post: {
      get validateRes() {
        return generalValidators.dbId;
      },
      async send(
        reqObj: Req<"PostSectionArr">
      ): Promise<Res<"PostSectionArr"> | undefined> {
        const res = await https.post(
          "saving",
          crud.sectionArr.path,
          reqObj.body
        );
        return this.validateRes(res);
      },
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
} as const;
