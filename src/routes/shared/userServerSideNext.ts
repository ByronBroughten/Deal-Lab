import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { BaseSectionsDb } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import { SectionNam } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import {
  GuestAccessSectionsNext,
  RegisterReqPayloadNext,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { makeMongooseObjectId } from "./../../client/src/App/sharedWithServer/utils/mongoose";
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
  makeDbUser({ newUserData, guestAccessSections }: MakeDbUserProps): UserDbRaw {
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
  makeMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    return new UserModelNext({
      _id: _id ?? makeMongooseObjectId(),
      ...this.makeDbUser(makeUserProps),
    });
  },
  makeDbAndMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    const dbUser = this.makeDbUser(makeUserProps);
    const mongoUser = new UserModelNext({
      _id: _id ?? makeMongooseObjectId(),
      ...dbUser,
    });
    return {
      dbUser,
      mongoUser,
    };
  },
  async entireMakeUserProcess({
    _id,
    ...payload
  }: RegisterReqPayloadNext & { _id?: mongoose.Types.ObjectId }): Promise<
    UserDbRaw & mongoose.Document<any, any, UserDbRaw>
  > {
    const newUserData = await this.makeUserData(payload);
    const userDoc = this.makeMongoUser({
      newUserData,
      guestAccessSections: payload.guestAccessSections,
      _id,
    });
    await userDoc.save();
    return userDoc;
  },
};

type MakeDbUserProps = {
  newUserData: NewUserDataNext;
  guestAccessSections: GuestAccessSectionsNext;
};

type MakeMongoUserProps = MakeDbUserProps & {
  _id?: mongoose.Types.ObjectId;
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
