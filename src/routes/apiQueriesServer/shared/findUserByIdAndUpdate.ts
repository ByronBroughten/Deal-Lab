import { Response } from "express";
import { ResHandledError } from "../../../middleware/error";
import { UserModelNext } from "../../shared/UserModelNext";

type TryFindByIdAndUpdateProps = {
  res: Response;
  userId: string;
  queryParameters: { operation: any; options: any };
};
export async function findUserByIdAndUpdate({
  res,
  userId,
  queryParameters: { operation, options },
}: TryFindByIdAndUpdateProps) {
  try {
    return await UserModelNext.findByIdAndUpdate(userId, operation, options);
  } catch (err) {
    if (err) res.status(500).send(err);
    throw new ResHandledError("Handled in tryFindByIdAndUpdate");
  }
}
