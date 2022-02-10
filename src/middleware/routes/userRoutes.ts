import express from "express";
import { loginUser } from "./userRoutes/login";
import bcrypt from "bcrypt";
import {
  makeDbUser,
  prepEmail,
  prepNewUserData,
  UserModel,
} from "./shared/makeDbUser";
import { validate } from "./shared/crudValidators";
import { DbSections } from "../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { Full } from "../../client/src/App/sharedWithServer/utils/typescript";
import { urls } from "../../client/src/App/Constants";

const userRouter = express.Router();
const userByEmailKey = "user.0.dbSections.user.0.dbVarbs.emailLower";

userRouter.post(urls.register.bit, async (req, res) => {
  const reqObj = validate.register.req(req, res);
  if (!reqObj) return;
  const { payload } = reqObj.body;

  const newUserData = await prepNewUserData(payload);
  const isUser = await UserModel.findOne(
    { [userByEmailKey]: newUserData.user.emailLower },
    undefined,
    { lean: true }
  );
  if (isUser)
    return res.status(400).send("An account with that email already exists.");

  const user = makeDbUser(newUserData);
  const userDoc = new UserModel(user);
  await userDoc.save();
  return loginUser(res, { ...user, _id: userDoc._id });
});



userRouter.post(urls.login.bit, async (req, res) => {
  const reqObj = validate.login.req(req, res);
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
  return loginUser(res, user);
});

export default userRouter;
