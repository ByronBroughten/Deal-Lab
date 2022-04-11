import { Request, Response } from "express";
import { config } from "../../client/src/App/Constants";
import { isLoginFormData } from "../../client/src/App/sharedWithServer/Crud/Login";
import { NextReq } from "../../client/src/App/sharedWithServer/CrudNext";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { UserDbNext } from "../shared/UserDbNext";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { loginUtils } from "./loginNext/loginUtils";

const crudLoginNext = {
  routeBit: config.crud.routes.nextLogin,
};

export async function login(req: Request, res: Response) {
  const reqObj = validateReq(req, res);
  if (!reqObj) return;

  const { email, password } = reqObj.body.payload;

  const { emailLower } = userServerSideNext.prepEmail(email);
  const user = await loginUtils.tryFindOneUserByEmail(emailLower);
  if (!user) return res.status(400).send("Invalid email address.");

  const serverUser = UserDbNext.init(user.toJSON());
  const userProtectedSection =
    serverUser.firstSectionPackHeadSection("userProtected");
  const { encryptedPassword } = userProtectedSection.dbVarbs as {
    encryptedPassword: string;
  };

  const isValidPw = loginUtils.checkPasswordAndResIfInvalid({
    password,
    encryptedPassword,
    res,
  });

  if (!isValidPw) return;
  return loginUtils.doLogin(res, user);
}

function validateReq(
  req: Request,
  res: Response
): NextReq<"nextLogin", "post"> | undefined {
  const { payload } = req.body;
  if (!Obj.noGuardIs(payload)) {
    res.status(500).send("Payload is not an object.");
    return;
  }
  if (!isLoginFormData(payload)) {
    res.status(400).send("Payload failed validation");
    return;
  }
  return { body: { payload } };
}

async function tryFindOneUserByEmail(emailLower: string) {
  try {
    return await UserModelNext.findOne(
      userServerSideNext.emailLowerFilter(emailLower),
      undefined,
      { lean: true }
    );
  } catch (err) {
    return undefined;
  }
}
