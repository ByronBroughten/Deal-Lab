import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import {
  DbStoreSeed,
  initProdDbStoreArrs,
  initTestDbStoreArrs,
} from "../../../../../client/src/App/sharedWithServer/exampleMakers/initDbStoreArrs";
import {
  DbStoreName,
  dbStoreNames,
} from "../../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
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

export async function initUserInDb(seed: DbStoreSeed) {
  const arrs =
    process.env.NODE_ENV === "test"
      ? initTestDbStoreArrs(seed)
      : initProdDbStoreArrs(seed);

  const dbUserModel = new DbUserModel({
    authId: seed.authId,
    email: seed.email,
    childDbIds: initChildDbIds(),
    ...arrs,
  });
  await dbUserModel.save();
}

function initChildDbIds(): Record<DbStoreName, string[]> {
  return dbStoreNames.reduce((ids, storeName) => {
    ids[storeName] = [];
    return ids;
  }, {} as Record<DbStoreName, string[]>);
}
