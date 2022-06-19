import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionPack/DbSectionInfo";
import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SimpleDbStoreName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionTypes/dbStoreNames";
import { ResStatusError } from "../../../../resErrorUtils";
import { DbSectionBase } from "./Bases/DbSectionBase";
import { DbSections, DbSectionsInitProps } from "./DbSections";

interface DbSectionInitProps<SN extends SimpleDbStoreName>
  extends DbSectionsInitProps,
    DbSectionInfo<SN> {}

export class DbSection<SN extends SimpleDbStoreName> extends DbSectionBase<SN> {
  static async init<SN extends SimpleDbStoreName>(
    props: DbSectionInitProps<SN>
  ): Promise<DbSection<SN>> {
    const userSections = await DbSections.init(props);
    return userSections.section(props);
  }
  sectionPack(): SectionPackRaw<SN> {
    this.dbSections[this.sectionName];
    const sectionPack = [...this.dbSections[this.sectionName]].find(
      (section) => section.dbId === this.dbId
    );
    if (sectionPack) {
      return {
        ...sectionPack,
        sectionName: this.sectionName,
      } as SectionPackRaw<SN>;
    } else {
      throw new ResStatusError({
        errorMessage: `Section not found at ${this.sectionName}.${this.dbId}`,
        resMessage: "The requested entry was not found",
        status: 404,
      });
    }
  }
}
