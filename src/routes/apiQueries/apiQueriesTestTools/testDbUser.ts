import { Server } from "http";
import request from "supertest";
import { deleteUser } from "supertokens-node";
import { revokeAllSessionsForUser } from "supertokens-node/recipe/session";
import {
  emailPasswordSignUp,
  getUsersByEmail,
} from "supertokens-node/recipe/thirdpartyemailpassword";
import { apiQueriesShared } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import { Str } from "../../../client/src/App/sharedWithServer/utils/Str";
import { DbUserModel } from "../../routesShared/DbUserModel";
import { LoadedDbUser } from "../apiQueriesShared/DbSections/LoadedDbUser";
import {
  getSignUpData,
  initUserInDb,
} from "../apiQueriesShared/DbSections/LoadedDbUser/userPrepS";

export async function createAndGetDbUser(
  testSuiteName: string
): Promise<LoadedDbUser> {
  const email = `${testSuiteName}/test@gmail.com`;
  await ensureFreshUserStart(email);

  const res = await emailPasswordSignUp(email, "TestP@ssword1");
  if (res.status === "OK") {
    const signUpData = getSignUpData(res.user);
    await initUserInDb({
      ...signUpData,
      userName: "Testosis",
    });
    return await LoadedDbUser.getBy("authId", signUpData.authId);
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

async function ensureFreshUserStart(email: string): Promise<void> {
  const users = await getUsersByEmail(email);
  for (const user of users) {
    await deleteAuthUser(user.id);
  }
}

export async function deleteUserTotally(dbUser: LoadedDbUser): Promise<void> {
  await deleteAuthUser(dbUser.authId);
  await DbUserModel.deleteOne({ _id: dbUser.userId });
}

export async function deleteAuthUser(authId: string) {
  await revokeAllSessionsForUser(authId);
  await deleteUser(authId);
}

export function getStandardRes(res: request.Response) {
  const { text } = res;
  return {
    status: res.status,
    headers: res.headers,
    data: Str.isJsonString(text) ? JSON.parse(text) : text,
  } as const;
}

export function validateStatus200Res(res: request.Response): void {
  if (res.status !== 200)
    throw new Error(`Query produced status ${res.status} rather than 200`);
}
