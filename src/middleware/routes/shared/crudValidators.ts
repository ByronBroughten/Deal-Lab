import { Request, Response } from "express";
import {
  DbId,
  GuestAccessSections,
  is,
  LoggedIn,
  LoggedInUser,
  RegisterFormData,
  Req,
  Res,
  zGuestAccessSections,
  zLoginFormData,
  zRegisterFormData,
} from "../../../client/src/App/sharedWithServer/User/crudTypes";
import { DbStoreName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import {
  SectionNam,
  SectionName,
  SectionNameType,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { DbEntry } from "../../../client/src/App/sharedWithServer/Analyzer/DbEntry";

export const serverSend = {
  success(
    res: Response,
    { data, headers }: { data: any; headers?: { [key: string]: string } }
  ) {
    res.header(headers).status(200).send(data);
  },
  resDataIsInvalid(res: Response, whatInvalid: string) {
    res.status(500).send(`Valid ${whatInvalid} not provided for response data`);
  },
};

export const serverValidate = {
  registerFormData(value: any, res: Response): value is RegisterFormData {
    if (zRegisterFormData.safeParse(value).success) return true;
    else {
      res.status(400).send("Invalid register form data.");
      return false;
    }
  },
  guestAccessSections(value: any, res: Response): value is GuestAccessSections {
    if (zGuestAccessSections.safeParse(value)) return true;
    else {
      res.status(500).send("Invalid guest access sections.");
      return false;
    }
  },
  loginFormData(value: any, res: Response): value is RegisterFormData {
    if (zLoginFormData.safeParse(value).success) return true;
    else {
      res.status(400).send("Invalid login form data.");
      return false;
    }
  },
  payloadIsObjOr500(value: any, res: Response): value is any {
    if (typeof value === "object") return true;
    else {
      res.status(500).send("Payload is not an object.");
      return false;
    }
  },

  payloadIsObj(value: any, res: Response): value is any {
    if (typeof value === "object") return true;
    else {
      res.status(500).send("Payload is not an object.");
      return false;
    }
  },
  userIsLoggedIn(value: any, res: Response): value is LoggedInUser {
    if (typeof value === "object" && typeof value._id === "string") return true;
    else {
      res.status(400).send("You are not properly logged in.");
      return false;
    }
  },
  sectionName<T extends SectionNameType>(
    value: any,
    res: Response,
    sectionNameType: T
  ): value is SectionName<T> {
    if (SectionNam.is(value, sectionNameType)) return true;
    else {
      res.status(500).send("Invalid database store name.");
      return false;
    }
  },
  dbStoreName(value: any, res: Response): value is DbStoreName {
    return this.sectionName(value, res, "dbStore");
  },
  dbId(value: any, res: Response): value is string {
    if (is.dbId(value)) return true;
    else {
      res.status(500).send("Invalid database id.");
      return false;
    }
  },
  dbEntry(value: any, res: Response): value is DbEntry {
    if (is.dbEntry(value)) return true;
    else {
      res.status(500).send("The payload is not a valid database entry.");
      return false;
    }
  },
  dbEntryArr(value: any, res: Response): value is DbEntry[] {
    if (is.dbEntryArr(value)) return true;
    else {
      res.status(500).send("The payload is not a valid database entry array.");
      return false;
    }
  },
} as const;

export const validate = {
  register: {
    req(req: Request, res: Response): Req<"Register"> | undefined {
      const { payload } = req.body;

      if (!serverValidate.payloadIsObj(payload, res)) return;
      const { registerFormData, guestAccessSections } = payload;
      if (
        serverValidate.registerFormData(registerFormData, res) &&
        serverValidate.guestAccessSections(guestAccessSections, res)
      ) {
        return {
          body: {
            payload: {
              registerFormData,
              guestAccessSections,
            },
          },
        };
      } else return;
    },
  },
  login: {
    req(req: Request, res: Response): Req<"Login"> | undefined {
      const { payload } = req.body;
      if (!serverValidate.loginFormData(payload, res)) return;
      return {
        body: {
          payload,
        },
      };
    },
  },
  postEntry: {
    req(req: Request, res: Response): LoggedIn<Req<"PostEntry">> | undefined {
      const { user, dbStoreName, payload } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.dbStoreName(dbStoreName, res) &&
        serverValidate.dbEntry(payload, res)
      ) {
        return {
          body: {
            user,
            dbStoreName,
            payload,
          },
        };
      } else return;
    },
    res(res: Response, data: DbId) {
      // the data for this doesn't really matter.
      if (is.dbId(data)) {
        const resObj: Res<"PostEntry"> = { data };
        serverSend.success(res, resObj);
      } else serverSend.resDataIsInvalid(res, "DbId");
    },
  },
  postEntryArr: {
    req(
      req: Request,
      res: Response
    ): LoggedIn<Req<"PostSectionArr">> | undefined {
      const { user, dbStoreName, payload } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.dbStoreName(dbStoreName, res) &&
        serverValidate.dbEntryArr(payload, res)
      ) {
        return {
          body: {
            user,
            dbStoreName,
            payload,
          },
        };
      } else return;
    },
    res(res: Response, data: DbStoreName) {
      if (SectionNam.is(data, "dbStore")) {
        const resObj: Res<"PostSectionArr"> = { data };
        serverSend.success(res, resObj);
      } else serverSend.resDataIsInvalid(res, "DbStoreName");
    },
  },
  postTableColumns: {
    req(
      req: Request,
      res: Response
    ): LoggedIn<Req<"PostTableColumns">> | undefined {
      const { user, dbStoreName, payload } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.sectionName(dbStoreName, res, "table") &&
        serverValidate.dbEntryArr(payload, res)
      ) {
        return {
          body: {
            user,
            dbStoreName,
            payload,
          },
        };
      } else return;
    },
    res(res: Response, data: DbEntry[]) {
      if (is.dbEntryArr(data)) {
        const resObj: Res<"PostTableColumns"> = { data };
        serverSend.success(res, resObj);
      } else serverSend.resDataIsInvalid(res, "DbEntryArr");
    },
  },
  putEntry: {
    req(req: Request, res: Response): LoggedIn<Req<"PutEntry">> | undefined {
      const { user, dbStoreName, payload } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.dbStoreName(dbStoreName, res) &&
        serverValidate.dbEntry(payload, res)
      ) {
        return {
          body: {
            user,
            dbStoreName,
            payload,
          },
        };
      } else return;
    },
    res(res: Response, data: DbId) {
      if (is.dbId(data)) {
        const resObj: Res<"PutEntry"> = { data };
        serverSend.success(res, resObj);
      } else serverSend.resDataIsInvalid(res, "DbId");
    },
  },
  getEntry: {
    req(req: Request, res: Response): LoggedIn<Req<"GetSection">> | undefined {
      const { dbStoreName, dbId } = req.params;
      const { user } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.dbStoreName(dbStoreName, res) &&
        serverValidate.dbId(dbId, res)
      ) {
        return {
          params: { dbStoreName, dbId },
          body: {
            user: user,
          },
        };
      } else return;
    },
    res(res: Response, data: DbEntry) {
      if (is.dbEntry(data)) {
        const resObj: Res<"GetSection"> = { data };
        return serverSend.success(res, resObj);
      } else return serverSend.resDataIsInvalid(res, "DbEntry");
    },
  },
  deleteEntry: {
    req(
      req: Request,
      res: Response
    ): LoggedIn<Req<"DeleteSection">> | undefined {
      const { dbStoreName, dbId } = req.params;
      const { user } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.dbStoreName(dbStoreName, res) &&
        serverValidate.dbId(dbId, res)
      ) {
        return {
          params: { dbStoreName, dbId },
          body: {
            user: user,
          },
        };
      } else return;
    },
    res(res: Response, data: DbId) {
      if (is.dbId(data)) {
        const resObj: Res<"DeleteSection"> = { data };
        return serverSend.success(res, resObj);
      } else return serverSend.resDataIsInvalid(res, "DbId");
    },
  },
};
