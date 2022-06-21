import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackLoaderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackLoaderSection";
import { UpdaterSection } from "../../../../client/src/App/sharedWithServer/StateUpdaters/UpdaterSection";
import { HandledResStatusError } from "../../../../resErrorUtils";
import { ServerUser } from "../../../ServerUser";
import { DbSectionsProps } from "./Bases/DbSectionsBase";
import { DbSections } from "./DbSections";
import { DbSectionsQuerier } from "./DbSectionsQuerier";
import { DbSectionsRaw } from "./DbSectionsQuerierTypes";
import { checkUserAuthToken, makeUserAuthToken } from "./DbUser/userAuthToken";

interface DbUserProps extends GetterSectionsProps {
  dbSections: DbSections;
}

export class DbUser extends GetterSectionsBase {
  dbSections: DbSections;
  constructor({ dbSections, ...rest }: DbUserProps) {
    super(rest);
    this.dbSections = dbSections;
  }
  get dbSectionsRaw(): DbSectionsRaw {
    return this.dbSections.dbSectionsRaw;
  }
  get userId(): string {
    const userId = this.dbSectionsRaw._id as mongoose.Types.ObjectId;
    return userId.toHexString();
  }
  static init(props: DbSectionsProps) {
    const dbSections = new DbSections(props);
    const userPack = dbSections.onlySectionPack("user");
    const serverUserPack = dbSections.onlySectionPack("serverOnlyUser");
    const omniLoader = new PackLoaderSection(
      UpdaterSection.initOmniParentProps()
    );
    omniLoader.loadChildSectionPack(userPack);
    omniLoader.loadChildSectionPack(serverUserPack);
    return new DbUser({
      ...omniLoader.getterSectionsProps,
      dbSections,
    });
  }
  static async queryByEmail(email: string): Promise<DbUser> {
    const querier = await DbSectionsQuerier.initByEmail(email);
    const dbSectionsRaw = await querier.getDbSectionsRaw();
    return DbUser.init({
      dbSectionsRaw,
    });
  }
  get get(): GetterSection<"user"> {
    return new GetterSection({
      ...this.stateSections.onlyOneRawSection("user"),
      ...this.getterSectionsProps,
    });
  }
  get serverOnlyUser(): GetterSection<"serverOnlyUser"> {
    return this.get.onlyCousin("serverOnlyUser");
  }
  async validatePassword(attemptedPassword: string): Promise<void> {
    const encryptedPassword = this.serverOnlyUser.value(
      "encryptedPassword",
      "string"
    );
    const isValid = await bcrypt.compare(attemptedPassword, encryptedPassword);
    if (!isValid) {
      throw new HandledResStatusError({
        resMessage: "That password is incorrect.",
        status: 400,
      });
    }
  }
  // do the make user auth thing.
  // also you'll need the res to send the header. hmmm.
  // also makeRawFeLoginUser is the main challenge.
  // you only have to send a "main" sectionPack, though, I say.
  // oh. And you don't have to update what you send. main can just be
  // as it was saved. It's best to let people pick up where
  // they left off, I think.

  // you ought to load the tables as they were saved.
  // but don't load the deal, property, loan, or mgmt.

  // register should save main the correct way, though.

  sendLogin(res: Response) {
    const userDb = ServerUser.init(this.dbSectionsRaw);
    const loggedInUser = userDb.makeRawFeLoginUser();
    const token = this.makeUserAuthToken();
    res
      .header(constants.tokenKey.apiUserAuth, token)
      .status(200)
      .send(loggedInUser);
  }
  makeUserAuthToken() {
    return DbUser.makeUserAuthToken(this.userId);
  }
  static checkUserAuthToken = checkUserAuthToken;
  static makeUserAuthToken = makeUserAuthToken;
}
