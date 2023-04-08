import bcrypt from "bcrypt";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import {
  DbStoreSeed,
  makeDefaultDbStoreArrs,
} from "../../../../../client/src/App/sharedWithServer/defaultMaker/makeDefaultDbStore";
import { StrictPick } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { ResStatusError } from "../../../../../utils/resError";
import { DbUserModel } from "../../../../routesShared/DbUserModel";
import { DbUser } from "../DbUser";

export function getSignUpData(
  user: ThirdPartyEmailPassword.User
): StrictPick<DbStoreSeed, "authId" | "email" | "timeJoined"> {
  const { id, email, timeJoined } = user;
  return {
    authId: id,
    email,
    timeJoined,
  };
}

export async function initUserInDb(props: DbStoreSeed) {
  const dbUserModel = new DbUserModel({
    authId: props.authId,
    email: props.email,
    ...makeDefaultDbStoreArrs(props),
  });
  await dbUserModel.save();
}

const _depreciatedUtils = {
  async encryptPassword(unencrypted: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(unencrypted, salt);
  },
  async checkThatEmailIsUnique(email: string): Promise<void> {
    if (await DbUser.existsBy("email", email)) {
      throw new ResStatusError({
        errorMessage: `An account with the email ${email} already exists.`,
        resMessage: "An account with that email already exists",
        status: 400,
      });
    }
  },
  processEmail(rawEmail: string): PreppedEmails {
    const emailAsSubmitted = rawEmail.trim();
    const email = emailAsSubmitted.toLowerCase();
    return {
      emailAsSubmitted,
      email,
    };
  },
};

type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};
