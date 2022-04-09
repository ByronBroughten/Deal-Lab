import { Response } from "express";
import { FilterQuery } from "mongoose";
import { DbUser } from "../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { QueryOp } from "../utils/operator";
import { UserModel } from "./severSideUser";

export const queryOptions = {
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

type Action = keyof typeof queryOptions;

export const mongo = {
  tryUpdateOne: async (
    res: Response,
    docId: string,
    operator: QueryOp,
    action: Action
  ) => {
    try {
      return await UserModel.updateOne(
        { _id: docId },
        operator,
        queryOptions[action]
      );
    } catch (err) {
      res.status(500).send(err);
      return null;
    }
  },
  async try<F extends () => any>(
    res: Response,
    fn: F
  ): Promise<ReturnType<F> | null> {
    try {
      return await fn();
    } catch (err) {
      res.status(500).send(err);
      return null;
    }
  },
  query: {
    async updateOne(
      res: Response,
      docId: string,
      operator: QueryOp,
      action: Action
    ) {
      return await mongo.try(res, async () => {
        return await UserModel.updateOne(
          { _id: docId },
          operator,
          queryOptions[action]
        );
      });
    },
  },
};

export async function tryFindByIdAndUpdate(
  res: Response,
  id: string,
  operator: QueryOp,
  action: Action
) {
  try {
    return await UserModel.findByIdAndUpdate(
      id,
      operator,
      queryOptions[action]
    );
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
      queryOptions[action]
    );
  } catch (err) {
    if (err) res.status(500).send(err);
    return;
  }
}
