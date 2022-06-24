import { Response } from "express";
import { FilterQuery, QueryOptions } from "mongoose";
import { handleResAndMakeError, ResHandledError } from "../../../resErrorUtils";
import { DbSectionsModel, DbSectionsModelCore } from "../../DbSectionsModel";

type QueryParameters = { operation: any; options: QueryOptions };

type FindUserByIdAndUpdateProps = {
  res: Response;
  userId: string;
  queryParameters: QueryParameters;
  doWhat?: string;
};
export async function findUserByIdAndUpdate({
  res,
  userId,
  ...rest
}: FindUserByIdAndUpdateProps) {
  return await findOneAndUpdate({ res, filter: { _id: userId }, ...rest });
}

type FindOneAndUpdateProps = {
  res: Response;
  filter: FilterQuery<DbSectionsModelCore>;
  queryParameters: QueryParameters;
  doWhat?: string;
};
export async function findOneAndUpdate({
  res,
  filter,
  queryParameters: { operation, options },
  doWhat = "query the database",
}: FindOneAndUpdateProps) {
  const result = await DbSectionsModel.findOneAndUpdate(
    filter,
    operation,
    options
  );
  if (result) return result;
  else throw handleResAndMakeError(res, 404, `Failed to ${doWhat}.`);
}

export async function updateOneUser({
  res,
  filter,
  queryParameters: { operation, options },
  doWhat = "query the database",
}: FindOneAndUpdateProps) {
  const result = await DbSectionsModel.findOneAndUpdate(
    filter,
    operation,
    options
  );
  if (!result) {
    res.status(404).send(`Failed to ${doWhat}.`);
    throw new ResHandledError(
      "DbSectionsModel.updateOne failed to update a user."
    );
  }
}
