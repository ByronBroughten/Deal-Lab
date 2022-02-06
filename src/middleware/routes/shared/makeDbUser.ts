import { Schema } from "mongoose";
import { getMonDbEntry } from "./mongooseValidators";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { DbStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { DbUser, NewUserData } from "../../../sharedWithServer/User/DbUser";
import { RegisterReqPayload } from "../../../sharedWithServer/User/crudTypes";
import { SectionNam } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { DbEnt } from "../../../sharedWithServer/Analyzer/DbEntry";

async function encryptPassword(unencrypted: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(unencrypted, salt);
}
export function prepEmail(email: string): {
  email: string;
  emailLower: string;
} {
  // this is needed separate for login
  const trimmedEmail = email.trim();
  return {
    email: trimmedEmail,
    emailLower: trimmedEmail.toLowerCase(),
  };
}
export async function prepNewUserData({
  registerFormData,
  guestAccessSections,
}: RegisterReqPayload): Promise<NewUserData> {
  const { userName, email, password } = registerFormData;
  return {
    user: {
      userName,
      ...prepEmail(email),
    },
    userProtected: {
      encryptedPassword: await encryptPassword(password),
    },
    guestAccessSections,
  };
}

export function makeDbUser(newUserData: NewUserData): DbUser {
  const partial: Partial<DbUser> = {
    ...newUserData.guestAccessSections,
    user: [DbEnt.initEntry("user", newUserData.user)],
    userProtected: [
      DbEnt.initEntry("userProtected", newUserData.userProtected),
    ],
  };

  for (const storeName of SectionNam.arr.dbStore) {
    if (!(storeName in partial)) partial[storeName] = [];
  }

  return partial as DbUser;
}

function makeMongooseUserSchema(): Schema<Record<DbStoreName, any>> {
  const partial: Partial<Record<DbStoreName, any>> = {};
  for (const sectionName of SectionNam.arr.dbStore) {
    partial[sectionName] = [getMonDbEntry()];
  }
  const frame = partial as Record<DbStoreName, any>;
  return new Schema(frame);
}

// type UserDoc = DbUser & Document;
export const UserModel = mongoose.model<DbUser>(
  "user",
  makeMongooseUserSchema()
);
