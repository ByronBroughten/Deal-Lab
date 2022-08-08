import { Request, Response } from "express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginFormData,
  LoginFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/login";
import { ResHandledError } from "../../utils/resError";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";
import { userPrepS } from "./shared/DbSections/LoadedDbUser/userPrepS";

export const loginWare = [login] as const;

async function login(req: Request, res: Response) {
  const reqObj = validateLoginReq(req, res);

  const { email: rawEmail, password } = reqObj.body;
  const { email } = userPrepS.processEmail(rawEmail);
  const dbUser = await LoadedDbUser.queryByEmail(email);
  await dbUser.validatePassword(password);
  dbUser.sendLogin(res);
}

function validateLoginReq(req: Request, res: Response): QueryReq<"login"> {
  return { body: validateLoginFormData(req.body, res) };
}

function validateLoginFormData(value: any, res: Response): LoginFormData {
  if (isLoginFormData(value)) return value;
  else {
    res.status(400).send("Payload failed loginFormData validation");
    throw new ResHandledError("Handled in validateLoginFormData");
  }
}
