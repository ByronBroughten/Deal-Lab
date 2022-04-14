import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { BaseSectionsDb } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import { SectionNam } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import {
  GuestAccessSectionsNext,
  RegisterReqPayloadNext,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/Register";
import { initDbSectionPack, UserDbRaw } from "./UserDbNext";
import { modelPath, UserModelNext } from "./UserModelNext";

export const userServerSideNext = {
  userEmailLowerPath: modelPath.firstSectionPackSectionVarb(
    "user",
    "user",
    "emailLower"
  ),
  emailLowerFilter(emailLower: string) {
    return { [this.userEmailLowerPath]: emailLower };
  },
  prepEmail(rawEmail: string): PreppedEmails {
    return {
      email: rawEmail.trim(),
      get emailLower() {
        return this.email.toLowerCase();
      },
    };
  },
  async makeUserData({
    registerFormData,
  }: RegisterReqPayloadNext): Promise<NewUserDataNext> {
    const { userName, email, password } = registerFormData;
    return {
      user: {
        userName,
        ...this.prepEmail(email),
      },
      userProtected: {
        encryptedPassword: await encryptPassword(password),
      },
    };
  },
  makeDbUser({ newUserData, guestAccessSections }: MakeUserProps): UserDbRaw {
    const partial: Partial<UserDbRaw> = {
      ...guestAccessSections,
      user: [initDbSectionPack("user", newUserData.user)],
      userProtected: [
        initDbSectionPack("userProtected", newUserData.userProtected),
      ],
    };

    for (const storeName of SectionNam.arrs.fe.dbStore) {
      if (!(storeName in partial)) partial[storeName] = [];
    }

    return partial as UserDbRaw;
  },
  makeMongoUser(makeUserProps: MakeUserProps) {
    return new UserModelNext({
      _id: new mongoose.Types.ObjectId(),
      ...this.makeDbUser(makeUserProps),
    });
  },
  makeDbAndMongoUser(makeUserProps: MakeUserProps) {
    const dbUser = this.makeDbUser(makeUserProps);
    const mongoUser = new UserModelNext({
      _id: new mongoose.Types.ObjectId(),
      ...dbUser,
    });
    return {
      dbUser,
      mongoUser,
    };
  },
  async entireMakeUserProcess(payload: RegisterReqPayloadNext) {
    const newUserData = await this.makeUserData(payload);
    return this.makeMongoUser({
      newUserData,
      guestAccessSections: payload.guestAccessSections,
    });
  },
};

type MakeUserProps = {
  newUserData: NewUserDataNext;
  guestAccessSections: GuestAccessSectionsNext;
};

type PreppedEmails = {
  email: string;
  emailLower: string;
};

export type NewUserDataNext = {
  user: SchemaVarbsToDbValues<UserVarbs>;
  userProtected: SchemaVarbsToDbValues<ProtectedUserVarbs>;
};
type UserVarbs = BaseSectionsDb["user"]["varbSchemas"];
type ProtectedUserVarbs = BaseSectionsDb["userProtected"]["varbSchemas"];

async function encryptPassword(unencrypted: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(unencrypted, salt);
}
