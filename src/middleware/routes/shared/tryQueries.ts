import { Response } from "express";
import { FilterQuery } from "mongoose";
import { DbUser } from "../../../sharedWithServer/User/DbUser";
import { QueryOp } from "../sectionEntry/operator";
import { UserModel } from "./makeDbUser";

const options = {
  put: {
    new: true,
    lean: true,
    useFindAndModify: false,
    runValidators: true,
    strict: false,
  },
  get post() {
    return { ...this.put, upsert: true };
  },
  delete: {
    new: true,
    lean: true,
    useFindAndModify: false,
  },
};

type Action = keyof typeof options;

export async function tryFindByIdAndUpdate(
  res: Response,
  id: string,
  operator: QueryOp,
  action: Action
) {
  try {
    return await UserModel.findByIdAndUpdate(id, operator, options[action]);
  } catch (err) {
    if (err) res.status(500).send(err);
    return;
  }
}

export async function tryFindOneAndUpdate(
  res: Response,
  filter: string | FilterQuery<DbUser>,
  updateQuery: QueryOp,
  action: Action
) {
  if (typeof filter === "string") filter = { _id: filter };
  try {
    return await UserModel.findOneAndUpdate(
      filter,
      updateQuery,
      options[action]
    );
  } catch (err) {
    if (err) res.status(500).send(err);
    return;
  }
}
