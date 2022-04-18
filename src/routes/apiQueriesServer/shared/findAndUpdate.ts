import { Response } from "express";
import { FilterQuery, QueryOptions } from "mongoose";
import { resHandledError, ResHandledError } from "../../../middleware/error";
import { UserDbRaw } from "../../shared/UserDbNext";
import { UserModelNext } from "../../shared/UserModelNext";

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
  filter: FilterQuery<UserDbRaw>;
  queryParameters: QueryParameters;
  doWhat?: string;
};
export async function findOneAndUpdate({
  res,
  filter,
  queryParameters: { operation, options },
  doWhat = "query the database",
}: FindOneAndUpdateProps) {
  const result = await UserModelNext.findOneAndUpdate(
    filter,
    operation,
    options
  );
  if (result) return result;
  else throw resHandledError(res, 404, `Failed to ${doWhat}.`);
}

export async function updateOneUser({
  res,
  filter,
  queryParameters: { operation, options },
  doWhat = "query the database",
}: FindOneAndUpdateProps) {
  const result = await UserModelNext.findOneAndUpdate(
    filter,
    operation,
    options
  );
  if (!result) {
    res.status(404).send(`Failed to ${doWhat}.`);
    throw new ResHandledError(
      "UserModelNext.updateOne failed to update a user."
    );
  }
}
