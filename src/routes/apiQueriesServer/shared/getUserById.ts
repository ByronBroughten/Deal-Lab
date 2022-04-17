import { Response } from "express";
import { resHandledError } from "../../../middleware/error";
import { UserModelNext } from "../../shared/UserModelNext";

const options = {
  new: true,
  lean: true,
  useFindAndModify: false,
};

type FindUserByIdProps = { userId: string; res: Response };
export async function getUserById({ userId, res }: FindUserByIdProps) {
  const user = await UserModelNext.findById(userId, undefined, options);
  if (user) return user;
  else throw resHandledError(res, 404, "You are not logged in.");
}

export async function getUserByIdNoRes(userId: string) {
  const user = await UserModelNext.findById(userId, undefined, options);
  if (user) return user;
  else throw new Error("No user found.");
}
