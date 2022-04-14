import { Response } from "express";
import { ResHandledError } from "../../../middleware/error";
import { UserModelNext } from "../../shared/UserModelNext";

type FindUserByIdProps = { userId: string; res: Response };
export async function getUserById({ userId, res }: FindUserByIdProps) {
  const user = await UserModelNext.findById(userId, undefined, {
    new: true,
    lean: true,
    useFindAndModify: false,
  });
  if (user) return user;
  else {
    res.status(404).send("You are not logged in.");
    throw new ResHandledError("Handled by getUserById");
  }
}
