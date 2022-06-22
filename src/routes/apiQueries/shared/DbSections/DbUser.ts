import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { sectionNameS } from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
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

  // I'm close, but there are some problems with how I'm saving things.

  // Having the properties in one place with the tables keeping
  // track of them
  // That means I must update the properties in two places

  // still, using a name like "sectionIndex" complicates matters

  // one other option is to have a container called, "mainPropertyStore"
  // its children would be the properties.

  // I would have to create new query functions, though, which I don't like.

  // I want to be able to use a store name, like propertyTableStore
  // and then use its child type, like table.
  // so propertyTableStore only contains one table
  // mainPropertyStore contains properties

  // a possible idea is to make a section called stores: {
  // propertyTableStore: { table }
  // mainPropertyStore: { property }
  // }
  // Then the db has corresponding sectionNames
  // that makes saving trickier, though.

  // The advantage of the other way, with the table synced with proerties
  // is that both the table and other things can reference the same properties
  // It's just that the properties don't mean anything if they're
  // not being referenced.
  // Maybe that's the key. For each section not referenced, it's deleted.
  // If something is saved, on the other hand, that references something
  // Hmm, no. This is weird.

  // Ok. I think I figured it out.

  // I know that if I were to keep all the properties etc in-memory,
  // there is a high liklihood that I wouldn't be able to store all that state
  // in local storage.

  // the tables contain that state
  // combine "addSection" and "updateSection"
  // when saving a property, save the property first, then save the table.
  // (or both simultaneously)
  // if the table fails to save, then the property isn't really saved
  // for not-full sections, the table is the source of truth.
  // then if a property isn't in a table but it somehow exists in the db
  // delete it.
  // if a property is in the table but doesn't exist in the db, something
  // went terribly wrong.

  // I forsee a future situation in which for some reason I have a second property store
  // That one might have full properties, like "defaultProperty"
  // if I still had "defaultProperty", it could still save in property, but it would
  // have its own dbId

  // The problem is that names and sectionTypes are intertwined.
  // Can I just have dbStores that have different names, but each of which
  // is assigned a type?
  // I could perform operations to and from different dbStores, and I would map the
  // sectionType to each one.
  // the dbStoreNames wouldn't necessarily have to be sectionNames. I like that.
  // just make dbStoreNames not have to be sectionNames (but they can be).
  // mainPropertyStore would have properties
  // but then when I load a deal, its more complicated to update its properties.
  // It would have to know to check, "mainPropertyStore". It would have to know
  // that "mainPropertyStore" is one of the stores to check for that kind
  // of thing and that what it stores is properties. Seems complicated.

  makeClientSideMain() {
    const packBuilder = PackBuilderSection.initAsRoot();
    packBuilder.addChild("main");

    // I'd like to add a get Getter to every one of those
    // that extends GetterSectionBase.
    // That requires making a new base—updaterSectionBase

    for (const childName of packBuilder.get.childNames) {
      if (sectionNameS.is(childName, "loadOnLoginNext")) {
        const children = packBuilder.children(childName);
        children.forEach((child) => {
          const { dbInfo } = child.get;
          // check for the section in dbSections
          // if it's there, load from it.
        });
      }
      // get the children,
      // add them to the stack
    }

    // Ok. For each child of main
    // if that childName is in "init" or what have you
    // search for the child in dbSectoins
  }
  sendLogin(res: Response) {
    const serverUser = ServerUser.init(this.dbSectionsRaw);
    const loggedInUser = serverUser.makeRawFeLoginUser();

    // change the login req so that loginUser is RawSectionPack<"main">
    // re-implement the serverUser "makeRawFeLoginUser" to essentially
    //   construct a "main" sectionPack

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
