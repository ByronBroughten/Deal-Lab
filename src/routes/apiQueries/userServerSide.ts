import mongoose from "mongoose";
import {
  GuestAccessSectionPackArrs,
  RegisterReqBody,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { sectionPackS } from "../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { DbSectionsModel, DbSectionsModelCore } from "../DbSectionsModel";
import { serverSectionS } from "../ServerSectionName";
import { DbSectionsRaw } from "./shared/DbSections/DbSectionsQuerierTypes";
import { DbUser, UserSections } from "./shared/DbSections/DbUser";

export const userServerSide = {
  makeDbSectionsRaw({
    _id = makeMongooseObjectId(),
    user,
    serverOnlyUser,
    guestAccessSections,
  }: MakeDbUserProps): DbSectionsRaw {
    const partial: Partial<DbSectionsModelCore> = {
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

    return new DbSectionsModel(partial as DbSectionsModelCore);
  },
  async makeAndSaveUser({
    _id,
    registerFormData,
    guestAccessSections,
  }: RegisterReqBody & { _id?: mongoose.Types.ObjectId }): Promise<
    DbSectionsModelCore & mongoose.Document<any, DbSectionsModelCore>
  > {
    const dbSections = await DbUser.initUserSections(registerFormData);
    const userDoc = this.makeDbSectionsRaw({
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
  guestAccessSections: GuestAccessSectionPackArrs;
}
