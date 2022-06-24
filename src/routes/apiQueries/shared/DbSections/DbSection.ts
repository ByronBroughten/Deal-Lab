import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionsMeta/DbSectionInfo";
import { StrictOmit } from "../../../../client/src/App/sharedWithServer/utils/types";
import { ServerSectionName } from "../../../ServerSectionName";
import { DbSectionBase, DbSectionProps } from "./Bases/DbSectionBase";
import { DbSections, DbSectionsInitByIdProps } from "./DbSections";
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
}
