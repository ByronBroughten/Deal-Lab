import { FilterQuery, QueryOptions } from "mongoose";
import { ResStatusError } from "../../../utils/resError";
import {
  DbSectionsModelCore,
  DbUserModel,
} from "../../routesShared/DbUserModel";

type QueryParameters = { operation: any; options: QueryOptions };

type FindUserByIdAndUpdateProps = {
  userId: string;
  queryParameters: QueryParameters;
  doWhat?: string;
};
export async function findUserByIdAndUpdate({
  userId,
  ...rest
}: FindUserByIdAndUpdateProps) {
  return await findOneAndUpdate({ filter: { _id: userId }, ...rest });
}

type FindOneAndUpdateProps = {
  filter: FilterQuery<DbSectionsModelCore>;
  queryParameters: QueryParameters;
  doWhat?: string;
};
export async function findOneAndUpdate({
  filter,
  queryParameters: { operation, options },
  doWhat = "query the database",
}: FindOneAndUpdateProps) {
  const result = await DbUserModel.findOneAndUpdate(filter, operation, options);
  if (result) return result;
  else {
    throw new ResStatusError({
      resMessage: `Failed to ${doWhat}.`,
      errorMessage: `Failed to ${doWhat}.`,
      status: 404,
    });
  }
}

export async function updateOneUser({
  filter,
  queryParameters: { operation, options },
  doWhat = "query the database",
}: FindOneAndUpdateProps) {
  const result = await DbUserModel.findOneAndUpdate(filter, operation, options);
  if (!result) {
    throw new ResStatusError({
      resMessage: `Failed to ${doWhat}.`,
      errorMessage: `Failed to ${doWhat}.`,
      status: 404,
    });
  }
}
