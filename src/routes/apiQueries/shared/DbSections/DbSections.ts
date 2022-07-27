import {
  ServerSectionPack,
  ServerStoreInfo,
  ServerStoreName,
} from "../../../ServerStoreName";
import { DbSectionsBase } from "./Bases/DbSectionsBase";
import { DbSectionsQuerier } from "./DbSectionsQuerier";
import { SectionPackNotFoundError } from "./DbSectionsQuerierTypes";

export interface DbSectionsInitByIdProps {
  userId: string;
}
export interface DbSectionsInitByEmailProps {
  email: string;
}
export class DbSections extends DbSectionsBase {
  onlySectionPack<CN extends ServerStoreName>(
    dbStoreName: CN
  ): ServerSectionPack<CN> {
    const sectionPacks = this.dbSectionsRaw[dbStoreName];
    if (sectionPacks.length !== 1) {
      throw new Error(
        `There are ${sectionPacks.length} sectionPacks with sectionName ${dbStoreName}, but there should be exactly 1.`
      );
    }
    return sectionPacks[0] as ServerSectionPack<any>;
  }
  sectionPackArr<CN extends ServerStoreName>(
    dbStoreName: CN
  ): ServerSectionPack<CN>[] {
    return this.dbSectionsRaw[dbStoreName] as ServerSectionPack<any>[];
  }
  sectionPack<CN extends ServerStoreName>({
    dbStoreName,
    dbId,
  }: ServerStoreInfo<CN>): ServerSectionPack<CN> {
    const dbPack = [...this.dbSectionsRaw[dbStoreName]].find(
      (dbPack) => dbPack.dbId === dbId
    );
    if (dbPack) {
      return dbPack as ServerSectionPack<any>;
    } else {
      throw new SectionPackNotFoundError({
        errorMessage: `dbSectionPack not found at ${dbStoreName}.${dbId}`,
        resMessage: "The requested entry was not found",
        status: 404,
      });
    }
  }
  hasSection({ dbStoreName, dbId }: ServerStoreInfo): boolean {
    const sectionPack = [...this.dbSectionsRaw[dbStoreName]].find(
      (section) => section.dbId === dbId
    );
    if (sectionPack) return true;
    else return false;
  }
  static async initByEmail({
    email,
  }: DbSectionsInitByEmailProps): Promise<DbSections> {
    const querier = await DbSectionsQuerier.initByEmail(email);
    return new DbSections({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
  static async initById({
    userId,
  }: DbSectionsInitByIdProps): Promise<DbSections> {
    const querier = await DbSectionsQuerier.init(userId, "userId");
    return new DbSections({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
}
