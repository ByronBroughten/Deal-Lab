import mongoose, { QueryOptions } from "mongoose";
import { GuestAccessSectionPackArrs } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { SectionVarbName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { VarbValue } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import {
  DbPack,
  DbSectionPack
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  OneDbSectionValueInfo,
  OneDbSectionVarbInfo
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreInfo";
import {
  DbSectionName,
  DbSelfOrDescendantSn,
  DbStoreInfo,
  DbStoreName,
  dbStoreNames
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { Obj } from "../../../../client/src/App/sharedWithServer/utils/Obj";
import { ResStatusError } from "../../../../resErrorUtils";
import { DbSectionsModel, modelPath } from "../../../DbSectionsModel";
import { DbSectionsQuerierBase } from "./Bases/DbSectionsQuerierBase";
import { DbSections } from "./DbSections";
import {
  DbSectionsRaw,
  dbUserFilters,
  DbUserSpecifierType,
  queryOptions,
  UserNotFoundError
} from "./DbUserTypes";
import { LoadedDbUser } from "./LoadedDbUser";

export class DbUser extends DbSectionsQuerierBase {
  async exists(): Promise<boolean> {
    return await DbSectionsModel.exists(this.userFilter);
  }
  async checkAndLoadGuestAccessSections(
    guestAccessSections: GuestAccessSectionPackArrs
  ): Promise<void> {
    if (!(await this.guestAccessSectionsAreLoaded)) {
      this.loadGuestAccessSections(guestAccessSections);
    }
  }
  async getUserId(): Promise<string> {
    const dbSections = await this.getDbSectionsRaw();
    const userId = dbSections._id;
    if (!(userId instanceof mongoose.Types.ObjectId))
      throw new Error(`userId "${userId}" is not valid.`);
    return userId.toHexString();
  }
  private get guestAccessInfo() {
    return {
      storeName: "userInfoPrivate",
      sectionName: "userInfoPrivate",
      varbName: "guestSectionsAreLoaded",
    } as const;
  }
  private get guestAccessSectionsAreLoaded() {
    return this.getOnlyValue(this.guestAccessInfo);
  }
  private async loadGuestAccessSections(
    guestAccessSections: GuestAccessSectionPackArrs
  ): Promise<void> {
    this.setOnlyValue({
      ...this.guestAccessInfo,
      value: true,
    });
    for (const storeName of Obj.keys(guestAccessSections)) {
      const sectionPackArr = guestAccessSections[storeName] as any[];
      this.setSectionPackArr({
        storeName,
        sectionPackArr,
      });
    }
  }
  async hasSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<boolean> {
    const dbSections = await this.dbSections();
    return dbSections.hasSection(dbInfo);
  }
  async getOnlyValue<
    CN extends DbStoreName,
    SN extends DbSectionName<CN>,
    VN extends SectionVarbName<SN>
  >({
    varbName,
    storeName,
    sectionName,
  }: OneDbSectionVarbInfo<CN, SN, VN>): Promise<VarbValue<SN, VN>> {
    const dbSections = await this.dbSections();
    const sectionPack = dbSections.onlySectionPack(
      storeName
    ) as SectionPack<SN>;
    const section = PackBuilderSection.loadAsOmniChild(sectionPack);
    return section.get.sections.oneAndOnly(sectionName).valueNext(varbName);
  }
  async getSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<DbSectionPack<CN>> {
    const dbSections = await this.dbSections();
    return dbSections.sectionPack(dbInfo);
    // It would be cool to query one pack directly, but it didn't work:
    // const users = await DbSectionsModel.aggregate([{ $match: this.userFilter }]);
    // const userDocs = await DbSectionsModel.aggregate([
    //   { $match: this.userFilter },
    //   { $unwind: `$${sectionName}` },
    //   // { $match: { [`${sectionName}.${dbId}`]: dbId } },
    // ]);
  }
  async updateSectionPack({
    dbStoreName,
    sectionPack,
  }: DbPack<any>): Promise<void> {
    const userId = await this.getUserId();
    const { dbId } = sectionPack;
    await this.update({
      filter: { _id: userId, [`${dbStoreName}.dbId`]: dbId },
      operation: { $set: { [`${dbStoreName}.$`]: sectionPack } },
      options: {
        new: true,
        lean: true,
        useFindAndModify: false,
        // runValidators: true,
        strict: false,
      },
    });
  }
  async addSectionPack({ dbStoreName, sectionPack }: DbPack<any>) {
    await this.update({
      operation: { $push: { [dbStoreName]: sectionPack } },
      options: {
        new: true,
        lean: true,
        useFindAndModify: false,
        runValidators: true,
        strict: false,
        upsert: true,
      },
    });
  }
  async deleteSectionPack({ dbStoreName, dbId }: DbStoreInfo) {
    await this.update({
      operation: { $pull: { [dbStoreName]: { dbId } } },
      options: {
        lean: true,
        useFindAndModify: false,
      },
    });
  }
  async setSectionPackArr<CN extends DbStoreName>({
    storeName,
    sectionPackArr,
  }: SetSectionPackArrProps<CN>): Promise<void> {
    await this.update({
      operation: { $set: { [`${storeName}`]: sectionPackArr } },
      options: {
        new: true,
        lean: true,
        useFindAndModify: false,
        // runValidators: true,
        strict: false,
      },
    });
  }
  async setOnlyValue<
    CN extends DbStoreName,
    SN extends DbSelfOrDescendantSn<CN>,
    VN extends SectionVarbName<SN>
  >({ value, ...rest }: OneDbSectionValueInfo<CN, SN, VN>) {
    this.update({
      operation: { $set: { [modelPath.firstSectionVarb(rest)]: value } },
      doWhat: "set value",
      options: {
        new: true,
        lean: true,
        useFindAndModify: false,
        // runValidators: true,
        strict: false,
      },
    });
  }
  async update({
    filter = this.userFilter,
    operation,
    options,
    doWhat = "query the database",
  }: UpdateProps) {
    const result = await DbSectionsModel.findOneAndUpdate(
      filter,
      operation,
      options
    );
    if (result) return result;
    else {
      throw new ResStatusError({
        resMessage: `Failed to ${doWhat}.`,
        errorMessage: `Failed to ${doWhat}.`,
        status: 404,
      });
    }
  }

  async getSectionPackArr<DSN extends DbStoreName>(
    dbStoreName: DSN
  ): Promise<DbSectionPack<DSN>[]> {
    const dbSections = await this.dbSections();
    return dbSections.sectionPackArr(dbStoreName);
  }
  async storeSectionCount(dbStoreName: DbStoreName): Promise<number> {
    const arr = await this.getSectionPackArr(dbStoreName);
    return arr.length;
  }
  private async dbSections(): Promise<DbSections> {
    const dbSectionsRaw = await this.getDbSectionsRaw();
    return new DbSections({ dbSectionsRaw });
  }

  async getDbSectionsRaw(): Promise<DbSectionsRaw> {
    const dbSectionsRaw = await DbSectionsModel.findOne(
      this.userFilter,
      undefined,
      queryOptions
    );
    if (dbSectionsRaw) return dbSectionsRaw as DbSectionsRaw;
    else throw this.userNotFoundError();
  }
  private userNotFoundError(): UserNotFoundError {
    return DbUser.userNotFoundError();
  }
  async loadedDbUser(): Promise<LoadedDbUser> {
    const dbSections = await this.dbSections();
    const dbStore = PackBuilderSection.initAsOmniChild("dbStore");
    for (const childName of dbStoreNames) {
      const sectionPacks = dbSections.sectionPackArr(childName);
      dbStore.loadChildren({
        childName,
        sectionPacks,
      });
    }
    return new LoadedDbUser({
      ...dbStore.getterSectionProps,
      dbSections,
    });
  }
  static async initBy(specifierType: DbUserSpecifierType, specifier: string) {
    const dbUser = new DbUser({
      userFilter: dbUserFilters[specifierType](specifier),
    });
    if (await dbUser.exists()) return dbUser;
    else throw this.userNotFoundError();
  }
  static async initByEmail(email: string): Promise<DbUser> {
    try {
      return this.initBy("email", email);
    } catch (ex) {
      if (ex instanceof UserNotFoundError) {
        throw new UserNotFoundError({
          errorMessage: "Invalid email.",
          resMessage: "That email address didn't work.",
          status: 400,
        });
      } else throw ex;
    }
  }
  static async existsBy(
    specifierType: DbUserSpecifierType,
    specifier: string
  ): Promise<boolean> {
    try {
      await this.initBy(specifierType, specifier);
      return true;
    } catch (ex) {
      if (ex instanceof UserNotFoundError) return false;
      else throw ex;
    }
  }
  static userNotFoundError(): UserNotFoundError {
    return new UserNotFoundError({
      errorMessage: "User not found.",
      resMessage: "Could not access user account.",
      status: 400,
    });
  }
}

type SetSectionPackArrProps<CN extends DbStoreName> = {
  storeName: CN;
  sectionPackArr: DbSectionPack<CN>[];
};

interface UpdateProps extends QueryParameters {
  filter?: Record<string, string>;
  doWhat?: string;
}

interface QueryParameters {
  operation: any;
  options: QueryOptions;
}
