import { Server } from "http";
import request from "supertest";
import { deleteUser } from "supertokens-node";
import { revokeAllSessionsForUser } from "supertokens-node/recipe/session";
import {
  emailPasswordSignUp,
  getUsersByEmail,
} from "supertokens-node/recipe/thirdpartyemailpassword";
import { apiQueriesShared } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import { DbSectionsModel } from "../../DbSectionsModel";
import { LoadedDbUser } from "../shared/DbSections/LoadedDbUser";
import { userPrepS } from "../shared/DbSections/LoadedDbUser/userPrepS";

export async function createAndGetDbUser(
  testSuiteName: string
): Promise<LoadedDbUser> {
  const email = `${testSuiteName}/test@gmail.com`;
  ensureFreshUserStart(email);

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

type CreateTestSessionProps = { server: Server; authId: string };
export async function makeSessionGetCookies({
  server,
  authId,
}: CreateTestSessionProps): Promise<string[]> {
  const cookieRes = await request(server)
    .post(apiQueriesShared.makeSession.pathRoute)
    .send({ authId });
  return cookieRes.get("Set-Cookie");
}

async function ensureFreshUserStart(email: string) {
  const users = await getUsersByEmail(email);
  if (users.length > 0) {
    for (const user of users) {
      await eraseUserAuth(user.id);
    }
  }
}

export async function deleteUserTotally(dbUser: LoadedDbUser): Promise<void> {
  await eraseUserAuth(dbUser.authId);
  await DbSectionsModel.deleteOne({ _id: dbUser.userId });
}

async function eraseUserAuth(authId: string) {
  await revokeAllSessionsForUser(authId);
  await deleteUser(authId);
}

export function getStandardRes(res: request.Response) {
  return {
    status: res.status,
    headers: res.headers,
    data: JSON.parse(res.text),
  } as const;
}

export function validateAddSectionRes(res: request.Response): void {
  if (res.status !== 200) throw new Error("addSection failed");
}
