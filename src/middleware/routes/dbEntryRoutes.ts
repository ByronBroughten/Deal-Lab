import express from "express";
import authWare from "../authWare";
import { queryOp } from "./sectionEntry/operator";
import { UserModel } from "./shared/makeDbUser";
import { validate } from "./shared/crudValidators";
import { tryFindByIdAndUpdate, tryFindOneAndUpdate } from "./shared/tryQueries";

import { getDbEntry } from "./sectionEntry/query";
import { DbEnt } from "../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { config } from "../../client/src/App/Constants";

const sectionRouter = express.Router();

// test post first
sectionRouter.post("/", authWare, async (req, res) => {
  const reqObj = validate.postEntry.req(req, res);
  if (!reqObj) return;
  const {
    payload,
    dbStoreName,
    user: { _id: userId },
  } = reqObj.body;

  const dbEntry = await getDbEntry(userId, dbStoreName, payload.dbId, res);
  if (dbEntry)
    return res
      .status(500)
      .send(
        `An entry in ${dbStoreName} already has the payload's dbId, ${payload.dbId}`
      );

  const pusher = queryOp.push.entry({ ...payload }, dbStoreName);
  const result = await tryFindByIdAndUpdate(res, userId, pusher, "post");
  if (result) validate.postEntry.res(res, payload.dbId);
});

sectionRouter.post(config.url.sectionArr.bit, authWare, async (req, res) => {
  const reqObj = validate.postEntryArr.req(req, res);
  if (!reqObj) return;
  const {
    payload,
    dbStoreName,
    user: { _id: userId },
  } = reqObj.body;

  const setter = queryOp.set.entryArr(payload, dbStoreName);
  const result = await tryFindByIdAndUpdate(res, userId, setter, "post");
  if (result) validate.postEntryArr.res(res, dbStoreName);
});
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
sectionRouter.put("/", authWare, async (req, res) => {
  const reqObj = validate.putEntry.req(req, res);
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
  if (result) validate.putEntry.res(res, payload.dbId);
});

sectionRouter.get("/:dbStoreName/:dbId", authWare, async (req, res) => {
  const reqObj = validate.getEntry.req(req, res);
  if (!reqObj) return;
  const {
    params: { dbId, dbStoreName },
    body: {
      user: { _id: userId },
    },
  } = reqObj;

  let dbEntry = await getDbEntry(userId, dbStoreName, dbId, res);
  if (!dbEntry) return res.status(404).send("That entry was not found.");
  else {
    validate.getEntry.res(res, dbEntry);
  }
});

sectionRouter.delete("/:dbStoreName/:dbId", authWare, async (req, res) => {
  const reqObj = validate.deleteEntry.req(req, res);
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
  });
  if (!user) return res.status(400).send("You are not logged in.");
  const puller = queryOp.pull.entry(dbId, dbStoreName);
  const result = await tryFindByIdAndUpdate(res, userId, puller, "delete");
  if (result) return validate.deleteEntry.res(res, dbId);
});

export default sectionRouter;
