import { QueryOptions } from "mongoose";
import { DbSectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  DbStoreInfo,
  DbStoreName,
  dbStoreNames,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { ResStatusError } from "../../../../resErrorUtils";
import { DbSectionsModel } from "../../../DbSectionsModel";
import { DbSectionsQuerierBase } from "./Bases/DbSectionsQuerierBase";
import { DbSections } from "./DbSections";
import {
  DbSectionsRaw,
  dbUserFilters,
  DbUserSpecifierType,
  queryOptions,
  UserNotFoundError,
} from "./DbUserTypes";
import { LoadedDbUser } from "./LoadedDbUser";

export class DbUser extends DbSectionsQuerierBase {
  async exists(): Promise<boolean> {
    return await DbSectionsModel.exists(this.userFilter);
  }
  async hasSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<boolean> {
    const dbSections = await this.dbSections();
    return dbSections.hasSection(dbInfo);
  }
  // getVarb would basically be "getSectionPack"

  // it would take storeName, sectionName, varbName

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
  async update({ operation, options, doWhat }: UpdateProps) {
    const result = await DbSectionsModel.findOneAndUpdate(
      this.userFilter,
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
  doWhat?: string;
}

interface QueryParameters {
  operation: any;
  options: QueryOptions;
}
