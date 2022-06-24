import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionsMeta/DbSectionInfo";
import { ServerSectionName } from "../../../ServerSectionName";
import { DbSectionsBase } from "./Bases/DbSectionsBase";
import { DbSection } from "./DbSection";
import { DbSectionsQuerier } from "./DbSectionsQuerier";
import { SectionPackNotFoundError } from "./DbSectionsQuerierTypes";

export interface DbSectionsInitByIdProps {
  userId: string;
}
export interface DbSectionsInitByEmailProps {
  email: string;
}
export class DbSections extends DbSectionsBase {
  onlySectionPack<SN extends ServerSectionName>(
    sectionName: SN
  ): SectionPackRaw<SN> {
    const sectionPacks = this.dbSectionsRaw[sectionName];
    if (sectionPacks.length !== 1) {
      throw new Error(
        `There are ${sectionPacks.length} sectionPacks with sectionName ${sectionName}, but there should be exactly 1.`
      );
    }
    return {
      ...sectionPacks[0],
      sectionName,
    } as SectionPackRaw<SN>;
  }
  sectionPackArr<SN extends ServerSectionName>(
    sectionName: SN
  ): SectionPackRaw<SN>[] {
    return this.dbSectionsRaw[sectionName].map((dbPack) => {
      return {
        ...dbPack,
        sectionName,
      } as SectionPackRaw<SN>;
    });
  }
  sectionPack<SN extends ServerSectionName>({
    sectionName,
    dbId,
  }: DbSectionInfo<SN>): SectionPackRaw<SN> {
    const dbPack = [...this.dbSectionsRaw[sectionName]].find(
      (dbPack) => dbPack.dbId === dbId
    );
    if (dbPack) {
      return {
        ...dbPack,
        sectionName,
      } as SectionPackRaw<SN>;
    } else {
      throw new SectionPackNotFoundError({
        errorMessage: `dbSectionPack not found at ${sectionName}.${dbId}`,
        resMessage: "The requested entry was not found",
        status: 404,
      });
    }
  }

  section<SN extends ServerSectionName>(
    dbInfo: DbSectionInfo<SN>
  ): DbSection<SN> {
    return new DbSection({
      ...this.dbSectionsProps,
      ...dbInfo,
    });
  }
  oneAndOnly<SN extends ServerSectionName>(sectionName: SN): DbSection<SN> {
    if (this.dbSectionsRaw[sectionName].length !== 1) {
      throw new Error("Something went wrong");
    }
    const { dbId } = this.dbSectionsRaw[sectionName][0];
    return this.section({ sectionName, dbId });
  }
  hasSection({ sectionName, dbId }: DbSectionInfo<ServerSectionName>): boolean {
    const sectionPack = [...this.dbSectionsRaw[sectionName]].find(
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
    const querier = await DbSectionsQuerier.initByUserId(userId);
    return new DbSections({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
}
