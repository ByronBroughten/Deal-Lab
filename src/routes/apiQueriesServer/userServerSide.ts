import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { BaseSectionsDb } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import { SectionNam } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import {
  GuestAccessSectionsNext,
  RegisterFormData,
  RegisterReqBody,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { StrictPick } from "../../client/src/App/sharedWithServer/utils/types";
import { initDbSectionPack, UserDbRaw } from "../shared/UserDbNext";
import { modelPath, UserModelNext } from "../shared/UserModelNext";

export const userServerSide = {
  userEmailLowerPath: modelPath.firstSectionPackSectionVarb(
    "user",
    "user",
    "email"
  ),
  findByEmailFilter(emailLower: string) {
    return { [this.userEmailLowerPath]: emailLower };
  },
  prepEmail(rawEmail: string): PreppedEmails {
    return {
      emailAsSubmitted: rawEmail.trim(),
      get email() {
        return this.emailAsSubmitted.toLowerCase();
      },
    } as const;
  },
  async makeNewUser(registerFormData: RegisterFormData): Promise<NewDbUser> {
    const { userName, email, password } = registerFormData;
    return {
      userName,
      apiAccessStatus: "basicStorage",
      encryptedPassword: await encryptPassword(password),
      ...this.prepEmail(email),
    };
  },
  makeDbUser({ newUser, guestAccessSections }: MakeDbUserProps): UserDbRaw {
    const partial: Partial<UserDbRaw> = {
      ...guestAccessSections,
      user: [initDbSectionPack("user", newUser)],
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
    registerFormData,
    guestAccessSections,
  }: RegisterReqBody & { _id?: mongoose.Types.ObjectId }): Promise<
    UserDbRaw & mongoose.Document<any, any, UserDbRaw>
  > {
    const newUser = await this.makeNewUser(registerFormData);
    const userDoc = this.makeMongoUser({
      newUser,
      guestAccessSections,
      _id,
    });
    await userDoc.save();
    return userDoc;
  },
};

type PreppedEmails = StrictPick<NewDbUser, "emailAsSubmitted" | "email">;
type NewDbUser = SchemaVarbsToDbValues<UserVarbs>;

type MakeDbUserProps = {
  newUser: NewDbUser;
  guestAccessSections: GuestAccessSectionsNext;
};
type UserVarbs = BaseSectionsDb["user"]["varbSchemas"];

type MakeMongoUserProps = MakeDbUserProps & {
  _id?: mongoose.Types.ObjectId;
};

async function encryptPassword(unencrypted: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(unencrypted, salt);
}
