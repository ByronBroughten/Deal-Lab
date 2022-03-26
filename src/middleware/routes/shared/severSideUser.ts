import { Schema } from "mongoose";
import { getMonDbEntry } from "./mongooseValidators";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { DbStoreName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import {
  DbUser,
  NewUserData,
} from "../../../client/src/App/sharedWithServer/User/DbUser";
import { RegisterReqPayload } from "../../../client/src/App/sharedWithServer/User/crudTypes";
import { SectionNam } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { DbEnt } from "../../../client/src/App/sharedWithServer/Analyzer/DbEntry";

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

export const serverSideUser = {
  findByEmailKey: "user.0.dbSections.user.0.dbVarbs.emailLower",
  async prepData({
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
  },
  finalizeData(newUserData: NewUserData): DbUser {
    const partial: Partial<DbUser> = {
      ...newUserData.guestAccessSections,
      user: [DbEnt.initEntry("user", newUserData.user)],
      userProtected: [
        DbEnt.initEntry("userProtected", newUserData.userProtected),
      ],
    };

    for (const storeName of SectionName.arrs.dbStore) {
      if (!(storeName in partial)) partial[storeName] = [];
    }

    return partial as DbUser;
  },
  make(newUserData: NewUserData) {
    return new UserModel({
      _id: new mongoose.Types.ObjectId(),
      ...this.finalizeData(newUserData),
    });
  },
  async full(payload: RegisterReqPayload) {
    const newUserData = await this.prepData(payload);
    return this.make(newUserData);
  },
};

function makeMongooseUserSchema(): Schema<Record<DbStoreName, any>> {
  const partial: Partial<Record<DbStoreName, any>> = {};
  for (const sectionName of SectionName.arrs.dbStore) {
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
