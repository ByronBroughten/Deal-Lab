import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginFormData,
  LoginFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/login";
import { ResHandledError } from "../../resErrorUtils";
import { DbUser } from "./shared/DbSections/DbUser";
import { userPrepS } from "./shared/DbSections/DbUser/userPrepS";

export const nextLoginWare = [loginServerSide] as const;

async function loginServerSide(req: Request, res: Response) {
  const reqObj = validateLoginReq(req, res);

  const { email: rawEmail, password } = reqObj.body;
  const { email } = userPrepS.processEmail(rawEmail);
  const dbUser = await DbUser.queryByEmail(email);
  await dbUser.validatePassword(password);
  dbUser.sendLogin(res);
}

function validateLoginReq(req: Request, res: Response): NextReq<"login"> {
  return { body: validateLoginFormData(req.body, res) };
}

function validateLoginFormData(value: any, res: Response): LoginFormData {
  if (isLoginFormData(value)) return value;
  else {
    res.status(400).send("Payload failed loginFormData validation");
    throw new ResHandledError("Handled in validateLoginFormData");
  }
}
