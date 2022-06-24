import mongoose from "mongoose";
import {
  GuestAccessSectionsNext,
  RegisterReqBody,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { sectionPackS } from "../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { DbSectionsModel, UserDbRaw } from "../DbSectionsModel";
import { serverSectionS } from "../ServerSectionName";
import { DbUser, UserSections } from "./shared/DbSections/DbUser";

export const userServerSide = {
  makeDbUser({
    _id = makeMongooseObjectId(),
    user,
    serverOnlyUser,
    guestAccessSections,
  }: MakeDbUserProps): UserDbRaw {
    const partial: Partial<UserDbRaw> = {
      _id,
      ...guestAccessSections,
      user: [sectionPackS.init({ sectionName: "user", dbVarbs: user })],
      serverOnlyUser: [
        sectionPackS.init({
          sectionName: "serverOnlyUser",
          dbVarbs: serverOnlyUser,
        }),
      ],
    };
    for (const storeName of serverSectionS.arrs.all) {
      if (!(storeName in partial)) partial[storeName] = [];
    }

    return partial as UserDbRaw;
  },
  makeMongoUser(props: MakeDbUserProps) {
    return new DbSectionsModel(this.makeDbUser(props));
  },
  async entireMakeUserProcess({
    _id,
    registerFormData,
    guestAccessSections,
  }: RegisterReqBody & { _id?: mongoose.Types.ObjectId }): Promise<
    UserDbRaw & mongoose.Document<any, UserDbRaw>
  > {
    const dbSections = await DbUser.initUserSections(registerFormData);
    const userDoc = this.makeMongoUser({
      ...dbSections,
      guestAccessSections,
      _id,
    });
    await userDoc.save();
    return userDoc;
  },
};

export interface MakeDbUserProps extends UserSections {
  _id?: mongoose.Types.ObjectId;
  guestAccessSections: GuestAccessSectionsNext;
}
