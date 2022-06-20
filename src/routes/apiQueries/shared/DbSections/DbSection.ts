import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionPack/DbSectionInfo";
import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { StrictOmit } from "../../../../client/src/App/sharedWithServer/utils/types";
import { ServerSectionName } from "../../../ServerSectionName";
import { DbSectionBase, DbSectionProps } from "./Bases/DbSectionBase";
import { DbSections, DbSectionsInitByIdProps } from "./DbSections";
import { DbSectionsQuerier } from "./DbSectionsQuerier";
import { SectionPackNotFoundError } from "./DbSectionsQuerierTypes";

export interface DbSectionInitByIdProps<SN extends ServerSectionName>
  extends DbSectionsInitByIdProps,
    DbSectionInfo<SN> {}

export interface DbSectionInitOnlyProps<SN extends ServerSectionName>
  extends StrictOmit<DbSectionInitByIdProps<SN>, "dbId"> {}

export class DbSection<SN extends ServerSectionName> extends DbSectionBase<SN> {
  dbSections = new DbSections(this.dbSectionsProps);
  constructor(props: DbSectionProps<SN>) {
    super(props);
    if (!this.dbSections.hasSection(this.dbInfo)) {
      throw new SectionPackNotFoundError({
        errorMessage: `Section not found at ${this.sectionName}.${this.dbId}`,
        resMessage: "The requested entry was not found",
        status: 404,
      });
    }
  }
  static async initOneAndOnly<SN extends ServerSectionName>(
    props: DbSectionInitOnlyProps<SN>
  ): Promise<DbSection<SN>> {
    const dbSections = await DbSections.initById(props);
    return dbSections.oneAndOnly(props.sectionName);
  }
  static async initById<SN extends ServerSectionName>(
    props: DbSectionInitByIdProps<SN>
  ): Promise<DbSection<SN>> {
    const dbSections = await DbSections.initById(props);
    return dbSections.section(props);
  }
  static async sectionPack<SN extends ServerSectionName>(
    props: DbSectionInitByIdProps<SN>
  ) {
    const querier = await DbSectionsQuerier.initByUserId(props.userId);
    return await querier.getSectionPack(props);
    // const dbSection = DbSection.initById(props);
    // return (await dbSection).sectionPack;
  }
  get rawSectionArr() {
    return this.sectionPack.rawSections[this.sectionName];
  }
  get rawSection() {
    const test = this.sectionPack.rawSections[this.sectionName];
    return test;
  }
  get sectionPack(): SectionPackRaw<SN> {
    this.dbSectionsRaw[this.sectionName];
    const sectionPack = [...this.dbSectionsRaw[this.sectionName]].find(
      (section) => section.dbId === this.dbId
    );
    if (sectionPack) {
      return {
        ...sectionPack,
        sectionName: this.sectionName,
      } as SectionPackRaw<SN>;
    } else {
      throw new Error("Something went wrong.");
    }
  }
}
