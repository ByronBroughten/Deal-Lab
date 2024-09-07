import mongoose, { FilterQuery, QueryOptions } from "mongoose";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import {
  DbPack,
  DbSectionPack,
} from "./client/src/sharedWithServer//StateTransports/DbSectionPack";
import { EstimatorPlanValues } from "./client/src/sharedWithServer/apiQueriesShared/EstimatorPlanValues";
import { constants } from "./client/src/sharedWithServer/Constants";
import { GetterSection } from "./client/src/sharedWithServer/StateGetters/GetterSection";
import {
  OneDbSectionValueInfo,
  OneDbVarbInfo,
} from "./client/src/sharedWithServer/StateGetters/Identifiers/DbStoreInfo";
import { FeSectionInfo } from "./client/src/sharedWithServer/StateGetters/Identifiers/FeInfo";
import {
  initProdDbStoreArrs,
  initTestDbStoreArrs,
} from "./client/src/sharedWithServer/StateOperators/exampleMakers/initDbStoreArrs";
import { PackBuilderSection } from "./client/src/sharedWithServer/StateOperators/Packers/PackBuilderSection";
import { VarbName } from "./client/src/sharedWithServer/stateSchemas/derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { ChildSectionName } from "./client/src/sharedWithServer/stateSchemas/derivedFromChildrenSchemas/ChildSectionName";
import {
  DbSectionName,
  DbStoreInfo,
  DbStoreName,
  dbStoreNames,
  getSectionDbStoreNames,
} from "./client/src/sharedWithServer/stateSchemas/derivedFromChildrenSchemas/DbStoreName";
import { SectionName } from "./client/src/sharedWithServer/stateSchemas/SectionName";
import {
  StoreName,
  StoreSectionName,
} from "./client/src/sharedWithServer/stateSchemas/sectionStores";
import {
  StateValue,
  VarbValue,
} from "./client/src/sharedWithServer/stateSchemas/StateValue";
import { ChildPackArrs } from "./client/src/sharedWithServer/StateTransports/ChildSectionPack";
import { SectionPack } from "./client/src/sharedWithServer/StateTransports/SectionPack";
import { UserData } from "./client/src/sharedWithServer/StateTransports/UserData";
import { Obj } from "./client/src/sharedWithServer/utils/Obj";
import {
  DbSectionsRaw,
  dbUserFilters,
  DbUserSpecifierType,
  modelPath,
  queryOptions,
  SectionPackNotFoundError,
  UserNotFoundError,
} from "./DbUserService/DbUserFiltersAndPaths";
import { DbUserGetter } from "./DbUserService/DbUserGetter";
import { DbSectionsModelCore, DbUserModel } from "./DbUserService/DbUserModel";
import { DbUserQuickGetter } from "./DbUserService/DbUserQuickGetter";
import { ResStatusError } from "./useErrorHandling";

interface Props {
  userFilter: { [key: string]: string };
}

interface InitUserInDbProps extends ThirdPartyEmailPassword.User {
  userName: string;
}

export class DbUserService {
  readonly userFilter: { [key: string]: string };
  constructor({ userFilter }: Props) {
    this.userFilter = userFilter;
  }
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
    const quickGetter = await this.getDbSectionsRaw();
    const userId = quickGetter._id;
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
    const quickGetter = await this.quickGetter();
    return quickGetter.hasSection(dbInfo);
  }
  async getOnlySectionValue<
    CN extends DbStoreName,
    VN extends VarbName<SN>,
    SN extends DbSectionName<CN> = DbSectionName<CN>
  >({
    varbName,
    storeName,
  }: OneDbVarbInfo<CN, VN, SN>): Promise<VarbValue<SN, VN>> {
    const getter = await this.dbUserGetter();
    const section = getter.get.onlyChild(
      storeName
    ) as GetterSection<any> as GetterSection<SN>;
    return section.valueNext(varbName);
  }
  async userInfo(): Promise<{ email: string; customerId: string }> {
    const { email, customerId } = await this.dbUserGetter();
    return {
      email,
      customerId,
    };
  }
  async subscriptionValues(): Promise<EstimatorPlanValues> {
    const getter = await this.dbUserGetter();
    return getter.subscriptionValues;
  }
  customerId(): Promise<string> {
    return this.getOnlySectionValue({
      storeName: "stripeInfoPrivate",
      varbName: "customerId",
    });
  }
  async getSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<DbSectionPack<CN>> {
    const quickGetter = await this.quickGetter();
    return quickGetter.sectionPack(dbInfo);
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
  async update({ filter = this.userFilter, operation, options }: UpdateProps) {
    return await DbUserService.findOneAndUpdate({
      filter,
      queryParameters: { operation, options },
    });
  }
  static async findUserByIdAndUpdate({
    userId,
    ...rest
  }: FindUserByIdAndUpdateProps) {
    return await this.findOneAndUpdate({ filter: { _id: userId }, ...rest });
  }
  static async findOneAndUpdate({
    filter,
    queryParameters: { operation, options },
    doWhat = "query the database",
  }: FindOneAndUpdateProps) {
    const result = await DbUserModel.findOneAndUpdate(
      filter,
      operation,
      options
    );
    if (result) {
      return result;
    } else {
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
    const quickGetter = await this.quickGetter();
    return quickGetter.sectionPackArr(dbStoreName);
  }
  async storeSectionCount(dbStoreName: DbStoreName): Promise<number> {
    const arr = await this.getSectionPackArr(dbStoreName);
    return arr.length;
  }
  private async quickGetter(): Promise<DbUserQuickGetter> {
    const dbSectionsRaw = await this.getDbSectionsRaw();
    return new DbUserQuickGetter({ dbSectionsRaw });
  }

  async getDbSectionsRaw(): Promise<DbSectionsRaw> {
    const dbSectionsRaw = await DbUserModel.findOne(
      this.userFilter,
      undefined,
      queryOptions
    );
    if (dbSectionsRaw) {
      return dbSectionsRaw as DbSectionsRaw;
    } else {
      throw this.userNotFoundError();
    }
  }
  private userNotFoundError(): UserNotFoundError {
    return DbUserService.userNotFoundError();
  }
  async getUserTokenAndData(): Promise<{ token: string; data: UserData }> {
    const getterUser = await this.dbUserGetter();
    return {
      data: getterUser.collectUserData(),
      token: getterUser.createUserJwt(),
    };
  }
  async dbUserGetter(): Promise<DbUserGetter> {
    const quickGetter = await this.quickGetter();
    const dbStore = PackBuilderSection.initAsOmniChild("dbStore");
    for (const childName of dbStoreNames) {
      let sectionPacks = quickGetter.sectionPackArr(childName);
      dbStore.replaceChildren({
        childName,
        sectionPacks,
      });
    }
    return new DbUserGetter({
      ...dbStore.getterSectionProps,
      quickGetter,
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
    return DbUserService.findUserByIdAndUpdate({
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
    const dbUser = new DbUserService({
      userFilter: dbUserFilters[specifierType](specifier),
    });
    if (await dbUser.exists()) return dbUser;
    else throw this.userNotFoundError();
  }
  static async initByEmail(email: string): Promise<DbUserService> {
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
  static async initInDb(initData: InitUserInDbProps) {
    const seed = {
      authId: initData.id,
      ...Obj.strictPick(initData, ["email", "timeJoined", "userName"]),
    };
    const arrs =
      process.env.NODE_ENV === "test"
        ? initTestDbStoreArrs(seed)
        : initProdDbStoreArrs(seed);

    const dbUserModel = new DbUserModel({
      authId: seed.authId,
      email: seed.email,
      childDbIds: this.initChildDbIds(),
      ...arrs,
    });
    await dbUserModel.save();
  }
  private static initChildDbIds(): Record<DbStoreName, string[]> {
    return dbStoreNames.reduce((ids, storeName) => {
      ids[storeName] = [];
      return ids;
    }, {} as Record<DbStoreName, string[]>);
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

type DbSectionPackArrs = ChildPackArrs<"dbStore">;

interface UpdateProps extends QueryParameters {
  filter?: Record<string, string>;
  doWhat?: string;
}

interface QueryParameters {
  operation: any;
  options: QueryOptions;
}

type FindOneAndUpdateProps = {
  filter: FilterQuery<DbSectionsModelCore>;
  queryParameters: QueryParameters;
  doWhat?: string;
};

type FindUserByIdAndUpdateProps = {
  userId: string;
  queryParameters: QueryParameters;
  doWhat?: string;
};
