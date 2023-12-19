import { Server } from "http";
import request from "supertest";
import { deleteUser } from "supertokens-node";
import { revokeAllSessionsForUser } from "supertokens-node/recipe/session";
import {
  emailPasswordSignUp,
  getUsersByEmail,
} from "supertokens-node/recipe/thirdpartyemailpassword";
import { DbUserService } from "../../../DbUserService";
import { DbUserGetter } from "../../../DbUserService/DbUserGetter";
import { DbUserModel } from "../../../DbUserService/DbUserModel";
import { apiQueriesShared } from "../../../client/src/sharedWithServer/apiQueriesShared";
import { Str } from "../../../client/src/sharedWithServer/utils/Str";

export async function createAndGetDbUser(
  testSuiteName: string
): Promise<DbUserGetter> {
  const email = `${testSuiteName}/test@gmail.com`;
  await ensureFreshUserStart(email);

  const res = await emailPasswordSignUp(email, "TestP@ssword1");
  if (res.status === "OK") {
    await DbUserService.initInDb({
      ...res.user,
      userName: "Testosis",
    });
    return await DbUserGetter.getBy("authId", res.user.id);
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

export async function deleteUserTotally(dbUser: DbUserGetter): Promise<void> {
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
