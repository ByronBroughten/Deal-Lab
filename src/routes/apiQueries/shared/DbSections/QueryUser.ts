import { QueryOptions } from "mongoose";
import { DbSectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  DbStoreInfo,
  DbStoreName
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { ResStatusError } from "../../../../resErrorUtils";
import { DbSectionsModel } from "../../../DbSectionsModel";
import { DbSectionsQuerierBase } from "./Bases/DbSectionsQuerierBase";
import { DbSections } from "./DbSections";
import {
  dbSectionsFilters,
  DbSectionsRaw,
  queryOptions,
  UserNotFoundError
} from "./DbSectionsQuerierTypes";

type DbSectionsIdentifier = "email" | "customerId" | "userId";
const filter = dbSectionsFilters;
export class QueryUser extends DbSectionsQuerierBase {
  static async init(identifier: string, identifierType: DbSectionsIdentifier) {
    const querier = new QueryUser({
      userFilter: filter[identifierType](identifier),
    });
    if (await querier.exists()) return querier;
    else throw this.userNotFoundError();
  }
  static async initByEmail(email: string): Promise<QueryUser> {
    try {
      return this.init(email, "email");
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
  static async existsByEmail(email: string): Promise<boolean> {
    try {
      await this.initByEmail(email);
      return true;
    } catch (ex) {
      if (ex instanceof UserNotFoundError) return false;
      else throw ex;
    }
  }

  async exists(): Promise<boolean> {
    return await DbSectionsModel.exists(this.userFilter);
  }
  async hasSectionPack<CN extends DbStoreName>(
    dbInfo: DbStoreInfo<CN>
  ): Promise<boolean> {
    const dbSections = await this.dbSections();
    return dbSections.hasSection(dbInfo);
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
  static userNotFoundError(): UserNotFoundError {
    return new UserNotFoundError({
      errorMessage: "User not found.",
      resMessage: "Could not access user account.",
      status: 400,
    });
  }
  private userNotFoundError(): UserNotFoundError {
    return QueryUser.userNotFoundError();
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
