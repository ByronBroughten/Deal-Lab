import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import {
  DbStoreName,
  dbStoreNames,
} from "../../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { StrictPick } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { DbUserModel } from "../../../../routesShared/DbUserModel";
import { DbStoreSeed, initDbStoreArrs } from "./initDbStoreArrs";

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
    childDbIds: initChildDbIds(),
    ...initDbStoreArrs(props),
  });
  await dbUserModel.save();
}

function initChildDbIds(): Record<DbStoreName, string[]> {
  return dbStoreNames.reduce((ids, storeName) => {
    ids[storeName] = [];
    return ids;
  }, {} as Record<DbStoreName, string[]>);
}
