import express, { Request, Response } from "express";
import authWare from "../authWare";
import { queryOp } from "./utils/operator";
import { UserModel } from "./shared/severSideUser";
import { serverSend, serverValidate, validate } from "./shared/crudValidators";
import { tryFindByIdAndUpdate, tryFindOneAndUpdate } from "./shared/tryQueries";
import { sectionGet } from "./utils/query";
import { DbEnt } from "../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { config } from "../../client/src/App/Constants";
import {
  LoggedIn,
  Req,
  Res,
} from "../../client/src/App/sharedWithServer/User/crudTypes";

const sectionRouter = express.Router();
export const sectionRoutes = {
  route: config.url.section.route,
  middleWare: [authWare],
  post: {
    validateReq(
      req: Request,
      res: Response
    ): LoggedIn<Req<"PostEntry">> | undefined {
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
    async receive(req: Request, res: Response) {
      const reqObj = this.validateReq(req, res);
      if (!reqObj) return;
      const {
        payload,
        dbStoreName,
        user: { _id: userId },
      } = reqObj.body;

      const dbEntry = await sectionGet(userId, dbStoreName, payload.dbId, res);
      if (dbEntry)
        return res
          .status(500)
          .send(
            `An entry in ${dbStoreName} already has the payload's dbId, ${payload.dbId}`
          );

      const pusher = queryOp.push.entry({ ...payload }, dbStoreName);
      const result = await tryFindByIdAndUpdate(res, userId, pusher, "post");
      if (result) {
        const resObj: Res<"PostEntry"> = { data: payload.dbId };
        serverSend.success(res, resObj);
      } else serverSend.falsyQuery(res, "findByIdAndUpdate");
    },
  },
  get: {
    validateReq(
      req: Request,
      res: Response
    ): LoggedIn<Req<"GetSection">> | undefined {
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
    async receive(req: Request, res: Response) {
      const reqObj = this.validateReq(req, res);
      if (!reqObj) return;
      const {
        params: { dbId, dbStoreName },
        body: {
          user: { _id: userId },
        },
      } = reqObj;

      let dbEntry = await sectionGet(userId, dbStoreName, dbId, res);
      if (dbEntry) {
        const resObj: Res<"GetSection"> = { data: dbEntry };
        return serverSend.success(res, resObj);
      } else return res.status(404).send("That entry was not found.");
    },
  },
  put: {
    validateReq(
      req: Request,
      res: Response
    ): LoggedIn<Req<"PutSection">> | undefined {
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
    async receive(req: Request, res: Response) {
      const reqObj = this.validateReq(req, res);
      if (!reqObj) return;
      const {
        payload,
        dbStoreName,
        user: { _id: userId },
      } = reqObj.body;

      const filter = {
        _id: userId,
        [`${dbStoreName}.dbId`]: payload.dbId,
      };
      const setter = {
        $set: {
          [`${dbStoreName}.$`]: payload,
        },
      };
      const result = await tryFindOneAndUpdate(res, filter, setter, "put");
      if (result) {
        const resObj: Res<"PutSection"> = { data: payload.dbId };
        serverSend.success(res, resObj);
      } else serverSend.falsyQuery(res, "findOneAndUpdate");
    },
  },
  delete: {
    validateReq(
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
    async receive(req: Request, res: Response) {
      const reqObj = this.validateReq(req, res);
      if (!reqObj) return;
      const {
        params: { dbId, dbStoreName },
        body: {
          user: { _id: userId },
        },
      } = reqObj;

      const user = await UserModel.findById(userId, undefined, {
        lean: true,
        useFindAndModify: false,
        new: true,
      });
      if (!user) return res.status(400).send("You are not logged in.");
      const puller = queryOp.pull.entry(dbId, dbStoreName);
      const result = await tryFindByIdAndUpdate(res, userId, puller, "delete");

      if (result) {
        const resObj: Res<"DeleteSection"> = { data: dbId };
        serverSend.success(res, resObj);
      } else serverSend.falsyQuery(res, "findByIdAndUpdate");
    },
  },
};

sectionRouter.post("/", ...sectionRoutes.middleWare, (req, res) =>
  sectionRoutes.post.receive(req, res)
);
sectionRouter.get(
  "/:dbStoreName/:dbId",
  ...sectionRoutes.middleWare,
  (req, res) => sectionRoutes.get.receive(req, res)
);
sectionRouter.put("/", ...sectionRoutes.middleWare, (req, res) =>
  sectionRoutes.put.receive(req, res)
);
sectionRouter.delete(
  "/:dbStoreName/:dbId",
  ...sectionRoutes.middleWare,
  (req, res) => sectionRoutes.delete.receive(req, res)
);

sectionRouter.post(
  config.url.tableColumns.route,
  authWare,
  async (req, res) => {
    const reqObj = validate.postTableColumns.req(req, res);
    if (!reqObj) return;

    const {
      payload,
      dbStoreName,
      user: { _id: userId },
    } = reqObj.body;

    const setter = queryOp.set.entryArr(payload, dbStoreName);
    const result = await tryFindByIdAndUpdate(res, userId, setter, "post");

    if (result) {
      const tableRows = DbEnt.newTableRows(result, dbStoreName);
      validate.postTableColumns.res(res, tableRows);
    }
  }
);

export default sectionRouter;
