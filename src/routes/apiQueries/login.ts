import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { LeanDocument } from "mongoose";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginFormData,
  LoginFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/login";
import { resHandledError, ResHandledError } from "../../middleware/error";
import { ServerUser, UserDbRaw } from "../ServerUser";
import { loginUtils } from "./login/loginUtils";
import { userServerSide } from "./userServerSide";

export const nextLoginWare = [loginServerSide] as const;

async function loginServerSide(req: Request, res: Response) {
  const reqObj = validateLoginReq(req, res);

  const { email: rawEmail, password } = reqObj.body;
  const { email } = userServerSide.prepEmail(rawEmail);

  const user = await validateEmail(email, res);

  await validateUserPassword({ user: user, attemptedPassword: password, res });
  return loginUtils.doLogin(res, user);
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

export async function validateEmail(email: string, res: Response) {
  const user = await loginUtils.tryFindOneUserByEmail(email);
  if (user) return user as LeanDocument<typeof user>;
  else throw resHandledError(res, 400, "Invalid email address.");
}

type ValidateUserPasswordProps = {
  user: UserDbRaw;
  attemptedPassword: string;
  res: Response;
};
async function validateUserPassword({
  user,
  attemptedPassword,
  res,
}: ValidateUserPasswordProps) {
  await validatePassword({
    attemptedPassword,
    encryptedPassword: getUserEncryptedPassword(user),
    res,
  });
}

function getUserEncryptedPassword(user: UserDbRaw): string {
  const dbUser = ServerUser.init(user);
  const userSection = dbUser.firstSectionPackHeadSection("serverOnlyUser");
  const { encryptedPassword } = userSection.dbVarbs;
  if (encryptedPassword === undefined) {
    throw new Error("There is no encrypted password");
  }
  return encryptedPassword as string;
}

async function validatePassword({
  attemptedPassword,
  encryptedPassword,
  res,
}: ValidatePasswordProps) {
  const isValidPw = await bcrypt.compare(attemptedPassword, encryptedPassword);
  if (!isValidPw) {
    res.status(400).send("Invalid password.");
    throw new ResHandledError("handled in validatePassword");
  }
}

type ValidatePasswordProps = {
  attemptedPassword: string;
  encryptedPassword: string;
  res: Response;
};
