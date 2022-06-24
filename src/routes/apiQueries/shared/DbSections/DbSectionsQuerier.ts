import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionsMeta/DbSectionInfo";
import { DbSectionsModel } from "../../../DbSectionsModel";
import { ServerSectionName } from "../../../ServerSectionName";
import { DbSectionsQuerierBase } from "./Bases/DbSectionsQuerierBase";
import { DbSections } from "./DbSections";
import {
  dbSectionsFilters,
  DbSectionsRaw,
  queryOptions,
  UserNotFoundError,
} from "./DbSectionsQuerierTypes";

const filter = dbSectionsFilters;
export class DbSectionsQuerier extends DbSectionsQuerierBase {
  static async initByEmail(email: string): Promise<DbSectionsQuerier> {
    const querier = new DbSectionsQuerier({ userFilter: filter.email(email) });
    if (await querier.exists()) return querier;
    else
      throw new UserNotFoundError({
        errorMessage: "Invalid email.",
        resMessage: "That email address didn't work.",
        status: 400,
      });
  }
  static async existsByEmail(email: string): Promise<boolean> {
    return await DbSectionsModel.exists(filter.email(email));
  }
  static async initByUserId(userId: string): Promise<DbSectionsQuerier> {
    const querier = new DbSectionsQuerier({
      userFilter: filter.userId(userId),
    });
    if (await querier.exists()) return querier;
    else throw this.userNotFoundError();
  }
  async exists(): Promise<boolean> {
    return await DbSectionsModel.exists(this.userFilter);
  }
  async getSectionPack<SN extends ServerSectionName>(
    dbInfo: DbSectionInfo<SN>
  ): Promise<SectionPackRaw<SN>> {
    // const users = await DbSectionsModel.aggregate([{ $match: this.userFilter }]);
    // const userDocs = await DbSectionsModel.aggregate([
    //   { $match: this.userFilter },
    //   { $unwind: `$${sectionName}` },
    //   // { $match: { [`${sectionName}.${dbId}`]: dbId } },
    // ]);
    const dbSectionsRaw = await this.getDbSectionsRaw();
    const dbSections = new DbSections({ dbSectionsRaw });
    return dbSections.sectionPack(dbInfo);
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
    return DbSectionsQuerier.userNotFoundError();
  }
}
