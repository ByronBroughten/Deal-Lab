import bcrypt from "bcrypt";
import { Response } from "express";
import {
  GetterSectionsBase,
  GetterSectionsProps
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackLoaderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackLoaderSection";
import { UpdaterSection } from "../../../../client/src/App/sharedWithServer/StateUpdaters/UpdaterSection";
import { HandledResStatusError } from "../../../../resErrorUtils";
import { DbSectionsProps } from "./Bases/DbSectionsBase";
import { DbSections } from "./DbSections";
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
  get userId(): string {
    const { _id } = this.dbSections.dbSectionsRaw;
    if (typeof _id === "string") return _id;
    else throw new Error(`_id is "${_id}", and not a string.`);
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

  async loginAndSend(res: Response) {
    const authToken = this.makeUserAuthToken();
  }
  makeUserAuthToken() {
    DbUser.makeUserAuthToken(this.userId);
  }
  static checkUserAuthToken = checkUserAuthToken;
  static makeUserAuthToken = makeUserAuthToken;  
}
