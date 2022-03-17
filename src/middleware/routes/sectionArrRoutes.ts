import { Request, Response } from "express";
import { config } from "../../client/src/App/Constants";
import {
  LoggedIn,
  Req,
  Res,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import authWare from "../authWare";
import { queryOp } from "./sectionEntry/operator";
import { serverSend, serverValidate } from "./shared/crudValidators";
import { tryFindByIdAndUpdate } from "./shared/tryQueries";
import express from "express";
// where does the middleware go? The route level? I guess so, or maybe both.

export const sectionArrRoutes = {
  route: config.url.sectionArr.route,
  middleWare: [authWare],
  post: {
    validateReq(
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
    async receive(req: Request, res: Response) {
      const reqObj = this.validateReq(req, res);
      if (!reqObj) return;
      const {
        payload,
        dbStoreName,
        user: { _id: userId },
      } = reqObj.body;

      const setter = queryOp.set.entryArr(payload, dbStoreName);
      const result = await tryFindByIdAndUpdate(res, userId, setter, "post");

      if (result) {
        const resObj: Res<"PostSectionArr"> = { data: dbStoreName };
        serverSend.success(res, resObj);
      } else res.status(404).send("tryFindByIdAndUpdate failed");
    },
  },
} as const;

const sectionArrRouter = express.Router();
sectionArrRouter.post("/", ...sectionArrRoutes.middleWare, async (req, res) =>
  sectionArrRoutes.post.receive(req, res)
);
export default sectionArrRouter;
