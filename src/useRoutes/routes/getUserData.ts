import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { DbUserService } from "../../DbUserService";
import { getSignUpData, initUserInDb } from "../../DbUserService/userPrepS";
import { Str } from "../../client/src/App/sharedWithServer/utils/Str";
import { getAuthWare, validateEmptyAuthReq } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";

const { getUserById } = ThirdPartyEmailPassword;

export const getUserDataWare = [getAuthWare(), getUserData] as const;

async function getUserData(req: SessionRequest, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;
  if (!(await DbUserService.existsBy("authId", auth.id))) {
    const authUser = await getUserById(auth.id);
    if (authUser) {
      await addUserToDb(authUser);
    } else {
      throw new Error("There is a session but no authUser");
    }
  }
  const dbUser = await DbUserService.initBy("authId", auth.id);
  const { token, data } = await dbUser.getUserTokenAndData();
  sendSuccess(res, "getUserData", {
    data,
    headers: { "user-auth-data-token": token },
  });
}

type FormFields = {
  id: string;
  value: string;
}[];

async function addUserToDb(authUser: ThirdPartyEmailPassword.User) {
  const userName = getUserName(authUser.email);
  const signUpData = getSignUpData(authUser);
  await initUserInDb({
    ...signUpData,
    userName,
  });
}

function getUserName(email: string, formFields?: FormFields) {
  if (formFields) {
    const userNameFromFields = userNameFromForm(formFields);
    if (userNameFromFields) return userNameFromFields;
  }
  return Str.emailBeforeAt(email);
}

function userNameFromForm(formFields: FormFields): string {
  const nameField = formFields.find((field) => field.id === "userName");
  return nameField ? nameField.value : "";
}
