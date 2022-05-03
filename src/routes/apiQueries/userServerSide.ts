import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  GuestAccessSectionsNext,
  RegisterFormData,
  RegisterReqBody,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { BaseSectionsDb } from "../../client/src/App/sharedWithServer/SectionMetas/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../../client/src/App/sharedWithServer/SectionMetas/relSections/rel/valueMetaTypes";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { serverSectionS } from "../ServerSectionName";
import { initDbSectionPack, UserDbRaw } from "../ServerUser";
import { modelPath, UserModel } from "../UserModel";

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
  async makeUserSections(
    registerFormData: RegisterFormData
  ): Promise<UserSections> {
    const { userName, email: rawEmail, password } = registerFormData;
    const { email, emailAsSubmitted } = this.prepEmail(rawEmail);
    return {
      user: {
        userName,
        email,
        apiAccessStatus: "basicStorage",
      },
      serverOnlyUser: {
        emailAsSubmitted,
        encryptedPassword: await encryptPassword(password),
      },
    };
  },
  makeDbUser({
    user,
    serverOnlyUser,
    guestAccessSections,
  }: MakeDbUserProps): UserDbRaw {
    const partial: Partial<UserDbRaw> = {
      ...guestAccessSections,
      user: [initDbSectionPack("user", user)],
      serverOnlyUser: [initDbSectionPack("serverOnlyUser", serverOnlyUser)],
    };
    for (const storeName of serverSectionS.arrs.all) {
      if (!(storeName in partial)) partial[storeName] = [];
    }

    return partial as UserDbRaw;
  },
  makeMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    return new UserModel({
      _id: _id ?? makeMongooseObjectId(),
      ...this.makeDbUser(makeUserProps),
    });
  },
  makeDbAndMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    const dbUser = this.makeDbUser(makeUserProps);
    const mongoUser = new UserModel({
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
    UserDbRaw & mongoose.Document<any, UserDbRaw>
  > {
    const userSections = await this.makeUserSections(registerFormData);
    const userDoc = this.makeMongoUser({
      ...userSections,
      guestAccessSections,
      _id,
    });
    await userDoc.save();
    return userDoc;
  },
};

interface MakeMongoUserProps extends MakeDbUserProps {
  _id?: mongoose.Types.ObjectId;
}

export interface MakeDbUserProps extends UserSections {
  guestAccessSections: GuestAccessSectionsNext;
}
interface UserSections {
  user: SharedUser;
  serverOnlyUser: ServerUser;
}

type SharedUser = SchemaVarbsToDbValues<SharedUserVarbs>;
type ServerUser = SchemaVarbsToDbValues<ServerOnlyUserVarbs>;

type SharedUserVarbs = BaseSectionsDb["user"]["varbSchemas"];
type ServerOnlyUserVarbs = BaseSectionsDb["serverOnlyUser"]["varbSchemas"];

type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};

async function encryptPassword(unencrypted: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(unencrypted, salt);
}
