import request from "supertest";
import { deleteUser } from "supertokens-node";
import { revokeAllSessionsForUser } from "supertokens-node/recipe/session";
import {
  emailPasswordSignUp,
  getUsersByEmail
} from "supertokens-node/recipe/thirdpartyemailpassword";
import { Id } from "../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import { getStandardNow } from "../../../client/src/App/sharedWithServer/utils/date";
import { DbSectionsModel } from "../../DbSectionsModel";
import { LoadedDbUser } from "../shared/DbSections/LoadedDbUser";
import { userPrepS } from "../shared/DbSections/LoadedDbUser/userPrepS";

export async function createTestDbUserAndLoadDepreciated(
  testSuiteName: string
): Promise<LoadedDbUser> {
  const authId = Id.make();
  await userPrepS.initUserInDb({
    email: `${testSuiteName}Test@gmail.com`,
    userName: "Testosis",
    timeJoined: getStandardNow(),
    authId,
  });
  return await LoadedDbUser.getBy("authId", authId);
}

// tokens = { cookies: { sAccessToken, sIdRefreshToken }, headers: { anti-csrf }}
export async function createTestDbUserAndLoad(
  testSuiteName: string
): Promise<LoadedDbUser> {
  const email = `${testSuiteName}Test@gmail.com`;
  const users = await getUsersByEmail(email);
  if (users.length > 0) {
    for (const user of users) {
      await deleteUser(user.id);
    }
  }

  const res = await emailPasswordSignUp(email, "TestP@ssword1");
  if (res.status === "OK") {
    const { user } = res;
    await userPrepS.initUserInDb({
      email,
      userName: "Testosis",
      timeJoined: user.timeJoined,
      authId: user.id,
    });
    return await LoadedDbUser.getBy("authId", user.id);
  } else {
    throw new Error("A user with that email already exists");
  }
}

export async function deleteDbUser(dbUser: LoadedDbUser): Promise<void> {
  await revokeAllSessionsForUser(dbUser.authId);
  await deleteUser(dbUser.userId);
  await DbSectionsModel.deleteOne({ _id: dbUser.userId });
}

export function getStandardRes(res: request.Response) {
  return {
    status: res.status,
    headers: res.headers,
    data: JSON.parse(res.text),
  };
}
