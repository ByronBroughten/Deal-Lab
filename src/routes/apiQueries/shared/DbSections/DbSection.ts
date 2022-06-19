import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SimpleDbStoreName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionTypes/dbStoreNames";
import { SectionNotFoundError } from "../../../../client/src/App/utils/error";
import { DbSectionBase } from "./Bases/DbSectionBase";

export class DbSection<SN extends SimpleDbStoreName> extends DbSectionBase<SN> {
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
      throw new SectionNotFoundError(
        `section not found at ${this.sectionName}.${this.dbId}`
      );
    }
  }
  
}
