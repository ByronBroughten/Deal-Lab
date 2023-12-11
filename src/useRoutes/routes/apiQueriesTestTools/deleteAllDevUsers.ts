import { deleteUser, getUsersNewestFirst } from "supertokens-node";
import { revokeAllSessionsForUser } from "supertokens-node/recipe/session";
import { DbUserModel } from "../../../database/DbUserModel";

export const deleteAllDevUsersWare = [deleteAllDevUsers];
async function deleteAllDevUsers() {
  if (!["test", "development"].includes(process.env.NODE_ENV)) {
    throw new Error("This is only for test and development environments");
  }
  await deleteAllUsers();
  // send success
}

async function deleteAllUsers() {
  const userRes = await getUsersNewestFirst();
  const { users } = userRes;
  for (const user of users) {
    deleteAuthUser(user.user.id);
  }
  await DbUserModel.deleteMany();
}

export async function deleteAuthUser(authId: string) {
  await revokeAllSessionsForUser(authId);
  await deleteUser(authId);
}
