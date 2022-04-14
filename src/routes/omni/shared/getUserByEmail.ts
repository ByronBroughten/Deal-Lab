import { Response } from "express";
import { ResHandledError } from "../../../middleware/error";
import { modelPath, UserModelNext } from "../../shared/UserModelNext";

const userEmailLowerPath = modelPath.firstSectionPackSectionVarb(
  "user",
  "user",
  "emailLower"
);

export async function getUserByLowercaseEmail(
  lowercaseEmail: string,
  res: Response
) {
  const user = await UserModelNext.findOne(
    { [userEmailLowerPath]: lowercaseEmail }
    // undefined,
    // { lean: true }
  );

  if (user) return user;
  else {
    res.status(400).send("Invalid email address.");
    throw new ResHandledError("Handled in getUserByLowercaseEmail");
  }  
}
