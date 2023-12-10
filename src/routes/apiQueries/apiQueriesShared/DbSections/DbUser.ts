import mongoose, { QueryOptions } from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import {
  OneDbSectionValueInfo,
  OneDbVarbInfo,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionInfo/DbStoreInfo";
import { FeSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { VarbName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildSectionName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import {
  DbPack,
  DbSectionPack,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbSectionPack";
import {
  DbSectionName,
  DbStoreInfo,
  DbStoreName,
  dbStoreNames,
  getSectionDbStoreNames,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { SectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  StoreName,
  StoreSectionName,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionStores";
import {
  StateValue,
  VarbValue,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers/PackBuilderSection";
import { SectionPackArrs } from "../../../../client/src/App/sharedWithServer/StatePackers/PackMakerSection";
import { Obj } from "../../../../client/src/App/sharedWithServer/utils/Obj";
import { ResStatusError } from "../../../../handleErrors";
import { DbUserModel, modelPath } from "../../../routesShared/DbUserModel";
import { findUserByIdAndUpdate } from "../findAndUpdate";
import { DbSectionsQuerierBase } from "./Bases/DbSectionsQuerierBase";
import { DbSections } from "./DbSections";
import {
  DbSectionsRaw,
  DbUserSpecifierType,
  SectionPackNotFoundError,
  UserNotFoundError,
  dbUserFilters,
  queryOptions,
} from "./DbUserTypes";
import { LoadedDbUser } from "./LoadedDbUser";

export class DbUser extends DbSectionsQuerierBase {
  async exists(): Promise<boolean> {
    return await DbUserModel.exists(this.userFilter);
  }
  async setSectionPackArrs(arrs: Partial<DbSectionPackArrs>): Promise<void> {
    for (const storeName of Obj.keys(arrs)) {
      const sectionPackArr = arrs[storeName] as any[];
      await this.setSectionPackArr({
        storeName,
        sectionPackArr,
      });
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
  async guestAccessSectionsAreLoaded() {
    return this.getOnlySectionValue(this.guestAccessInfo);
  }
  async hasSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<boolean> {
    const dbSections = await this.dbSections();
    return dbSections.hasSection(dbInfo);
  }
  async getOnlySectionValue<
    CN extends DbStoreName,
    VN extends VarbName<SN>,
    SN extends DbSectionName<CN> = DbSectionName<CN>
  >({
    varbName,
    storeName,
  }: OneDbVarbInfo<CN, VN, SN>): Promise<VarbValue<SN, VN>> {
    const loaded = await this.loadedDbUser();
    const section = loaded.get.onlyChild(storeName) as GetterSection<SN>;
    return section.valueNext(varbName);
  }
  async getSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<DbSectionPack<CN>> {
    const dbSections = await this.dbSections();
    return dbSections.sectionPack(dbInfo);
    // It would be cool to query one pack directly, but it didn't work:
    // const users = await DbUserModel.aggregate([{ $match: this.userFilter }]);
    // const userDocs = await DbUserModel.aggregate([
    //   { $match: this.userFilter },
    //   { $unwind: `$${sectionName}` },
    //   // { $match: { [`${sectionName}.${dbId}`]: dbId } },
    // ]);
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
  async setOnlyValue<
    CN extends DbStoreName,
    SN extends SectionName,
    VN extends VarbName<SN>
  >({ value, ...rest }: OneDbSectionValueInfo<CN, SN, VN>) {
    const path = modelPath.firstSectionVarb(rest);
    await this.update({
      operation: { $set: { [`${path}`]: value } },
      doWhat: "set value",
      options: {
        useFindAndModify: false,
        lean: true,
      },
    });
  }
  async update({
    filter = this.userFilter,
    operation,
    options,
    doWhat = "query the database",
  }: UpdateProps) {
    const result = await DbUserModel.findOneAndUpdate(
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
    const dbSectionsRaw = await DbUserModel.findOne(
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
      let sectionPacks = dbSections.sectionPackArr(childName);
      dbStore.replaceChildren({
        childName,
        sectionPacks,
      });
    }
    return new LoadedDbUser({
      ...dbStore.getterSectionProps,
      dbSections,
    });
  }
  async addSection<CN extends StoreName>(props: {
    storeName: CN;
    labSubscription: StateValue<"labSubscription">;
    sectionPack: SectionPack<StoreSectionName<CN>>;
  }): Promise<any> {
    const { sectionPack, storeName } = props;

    await this.validateIsRoomForStorage(props);
    await this.checkThatSectionPackIsNotThere({
      storeName,
      dbId: sectionPack.dbId,
    });
    return findUserByIdAndUpdate({
      userId: await this.getUserId(),
      queryParameters: {
        operation: { $push: { [storeName]: sectionPack } },
        options: {
          new: true,
          lean: true,
          useFindAndModify: false,
          runValidators: true,
          strict: false,
          upsert: true,
        },
      },
    });
  }
  private async validateIsRoomForStorage({
    labSubscription,
    storeName,
  }: {
    labSubscription: StateValue<"labSubscription">;
    storeName: StoreName;
  }) {
    switch (labSubscription) {
      case "fullPlan": {
        return true;
      }
      case "basicPlan": {
        const { basicStorageLimit } = constants;
        const count = await this.storeSectionCount(storeName);
        if (count < basicStorageLimit) return true;
        else
          throw new ResStatusError({
            errorMessage: `To save more than ${basicStorageLimit} of anything, you must have a Pro account.`,
            resMessage: `To save more than ${basicStorageLimit} of anything, you must have a Pro account.`,
            status: 400,
          });
      }
    }
  }
  private async checkThatSectionPackIsNotThere(props: {
    storeName: StoreName;
    dbId: string;
  }): Promise<true> {
    const { storeName, dbId } = props;
    try {
      await this.getSectionPack({
        dbStoreName: storeName,
        dbId,
      });
      throw new ResStatusError({
        errorMessage: `An entry at ${storeName}.${dbId} already exists.`,
        resMessage:
          "That section has already been saved. Try logging out and logging back in. Our apologies.",
        status: 400,
      });
    } catch (err) {
      if (err instanceof SectionPackNotFoundError) {
        return true;
      } else {
        throw err;
      }
    }
  }

  async syncSectionPack<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ) {
    const headSection = PackBuilderSection.hydratePackAsOmniChild(sectionPack);
    const { sections } = headSection;
    let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
    while (sectionInfos.length > 0) {
      const nextInfos: FeSectionInfo[] = [];
      for (const info of sectionInfos) {
        const section = sections.section(info);
        for (const childName of section.get.childNames) {
          for (const child of section.children(childName)) {
            const getterChild = child.get;
            if (getterChild.isSectionType("deal")) {
              if (getterChild.valueNext("autoSyncControl") === "autoSyncOn") {
                const { sectionName, dbId } = getterChild;
                const dbStoreNames = getSectionDbStoreNames(sectionName);
                if (dbStoreNames.length !== 1) {
                  throw new Error("This wasn't implemented right, yet");
                }
                const dbStoreName = dbStoreNames[0];
                const childDbInfo = { dbStoreName, dbId };
                if (await this.hasSectionPack(childDbInfo)) {
                  const childPack = await this.getSectionPack(childDbInfo);
                  child.overwriteSelf(childPack as any as SectionPack<any>);
                } else {
                  const syncValue: StateValue<"autoSyncControl"> =
                    "autoSyncOff";
                  child.updater.updateValues({
                    autoSyncControl: syncValue,
                  } as any);
                }
              }
            }
            nextInfos.push(child.feInfo);
          }
        }
      }
      sectionInfos = nextInfos;
    }
    return headSection.makeSectionPack();
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
  static userNotFoundError(options?: UserNotFoundOptions): UserNotFoundError {
    let errorMessage = "User not found";
    if (options) {
      const { idType, id } = options;
      errorMessage = errorMessage + ` with ${idType} "${id}"`;
    }
    return new UserNotFoundError({
      errorMessage,
      resMessage: "Could not access user account.",
      status: 400,
    });
  }
}
type UserNotFoundOptions = {
  idType: string;
  id: string;
};

type SetSectionPackArrProps<CN extends DbStoreName> = {
  storeName: CN;
  sectionPackArr: DbSectionPack<CN>[];
};

type DbSectionPackArrs = SectionPackArrs<"dbStore">;

interface UpdateProps extends QueryParameters {
  filter?: Record<string, string>;
  doWhat?: string;
}

interface QueryParameters {
  operation: any;
  options: QueryOptions;
}
