import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  isLoginFormData,
  LoginFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/Login";
import { ResHandledError } from "../../middleware/error";
import { UserDbNext, UserDbRaw } from "../shared/UserDbNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { loginUtils } from "./nextLogin/loginUtils";
import { getUserByLowercaseEmail } from "./shared/getUserByEmail";

export const nextLoginWare = [loginServerSide] as const;

async function loginServerSide(req: Request, res: Response) {
  const reqObj = validateLoginReq(req, res);

  const { email, password } = reqObj.body.payload;
  const { emailLower } = userServerSideNext.prepEmail(email);

  const user = await getUserByLowercaseEmail(emailLower, res);
  const pojoUser = user.toJSON();

  validateUserPassword({ user: pojoUser, attemptedPassword: password, res });
  return loginUtils.doLogin(res, pojoUser);
}

function validateLoginReq(req: Request, res: Response): NextReq<"nextLogin"> {
  const { payload } = req.body;
  return { body: { payload: validateLoginFormData(payload, res) } };
}

function validateLoginFormData(value: any, res: Response): LoginFormData {
  if (isLoginFormData(value)) return value;
  else {
    res.status(400).send("Payload failed loginFormData validation");
    throw new ResHandledError("Handled in validateLoginFormData");
  }
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
  const serverUser = UserDbNext.init(user);
  const userProtectedSection =
    serverUser.firstSectionPackHeadSection("userProtected");
  return userProtectedSection.dbVarbs.encryptedPassword as string;
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
