import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  Req,
  zLoginFormData,
} from "../../../client/src/App/sharedWithServer/Crud";
import { DbSections } from "../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { Full } from "../../client/src/App/sharedWithServer/utils/types";
import { prepEmail, UserModel } from "../shared/severSideUser";
import { serverSideLogin } from "./shared/doLogin";

function validateReq(req: Request, res: Response): Req<"Login"> | undefined {
  const { payload } = req.body;
  if (!Obj.noGuardIs(payload)) {
    res.status(500).send("Payload is not an object.");
    return;
  }
  if (!zLoginFormData.safeParse(payload).success) {
    res.status(400).send("Payload failed validation");
    return;
  }
  return { body: { payload } };
}

const userByEmailKey = "user.0.dbSections.user.0.dbVarbs.emailLower";
export async function login(req: Request, res: Response) {
  const reqObj = validateReq(req, res);
  if (!reqObj) return;

  const { email, password } = reqObj.body.payload;
  const { emailLower } = prepEmail(email);
  const user = await UserModel.findOne(
    { [userByEmailKey]: emailLower },
    undefined,
    {
      lean: true,
    }
  );
  if (!user) return res.status(400).send("Invalid email address.");
  const dbSections = user.userProtected[0].dbSections as Full<DbSections>;
  const { encryptedPassword } = dbSections.userProtected[0].dbVarbs as {
    encryptedPassword: string;
  };
  const isValidPw = await bcrypt.compare(password, encryptedPassword);
  if (!isValidPw) return res.status(400).send("Invalid password.");
  return serverSideLogin.do(res, user);
}
