import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionPack/DbSectionInfo";
import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { ServerSectionName } from "../../../ServerSectionName";
import { UserModel } from "../../../UserModel";
import { DbSectionsQuerierBase } from "./Bases/DbSectionsQuerierBase";
import {
  dbSectionsFilters,
  DbSectionsRaw,
  queryOptions,
  SectionPackNotFoundError,
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
  static async initByUserId(userId: string): Promise<DbSectionsQuerier> {
    const querier = new DbSectionsQuerier({
      userFilter: filter.userId(userId),
    });
    if (await querier.exists()) return querier;
    else throw this.userNotFoundError();
  }
  async exists(): Promise<boolean> {
    return await UserModel.exists(this.userFilter);
  }
  async getSectionPack<SN extends ServerSectionName>({
    sectionName,
    dbId,
  }: DbSectionInfo<SN>): Promise<SectionPackRaw<SN>> {
    // const users = await UserModel.aggregate([{ $match: this.userFilter }]);
    // const userDocs = await UserModel.aggregate([
    //   { $match: this.userFilter },
    //   { $unwind: `$${sectionName}` },
    //   // { $match: { [`${sectionName}.${dbId}`]: dbId } },
    // ]);
    const dbSectionsRaw = await this.getDbSectionsRaw();
    const sectionPack = [...dbSectionsRaw[sectionName]].find(
      (sectionPack) => sectionPack.dbId === dbId
    );
    if (sectionPack) {
      return {
        ...sectionPack,
        sectionName,
      } as SectionPackRaw<SN>;
    } else {
      throw new SectionPackNotFoundError({
        errorMessage: `Section not found at ${sectionName}.${dbId}`,
        resMessage: "The requested entry was not found",
        status: 404,
      });
    }
  }
  async getDbSectionsRaw(): Promise<DbSectionsRaw> {
    const dbSectionsRaw = await UserModel.findOne(
      this.userFilter,
      undefined,
      queryOptions
    );
    if (dbSectionsRaw) return dbSectionsRaw;
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
