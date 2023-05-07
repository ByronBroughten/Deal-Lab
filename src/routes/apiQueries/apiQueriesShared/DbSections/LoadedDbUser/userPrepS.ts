import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import {
  DbStoreSeed,
  makeDefaultDbStoreArrs,
} from "../../../../../client/src/App/sharedWithServer/defaultMaker/makeDefaultDbStore";
import { StrictPick } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { DbUserModel } from "../../../../routesShared/DbUserModel";

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
