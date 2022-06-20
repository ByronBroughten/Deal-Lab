import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionPack/DbSectionInfo";
import { ServerSectionName } from "../../../ServerSectionName";
import { DbSectionsBase } from "./Bases/DbSectionsBase";
import { DbSection } from "./DbSection";
import { DbSectionsQuerier } from "./DbSectionsQuerier";

export interface DbSectionsInitByIdProps {
  userId: string;
}
export interface DbSectionsInitByEmailProps {
  email: string;
}
export class DbSections extends DbSectionsBase {
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
