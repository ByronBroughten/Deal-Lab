import { DbSectionInfo } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/DbSectionInfo";
import { ServerSectionName } from "../../../../ServerSectionName";
import { DbSectionsBase, DbSectionsProps } from "./DbSectionsBase";

export interface DbSectionProps<SN extends ServerSectionName>
  extends DbSectionsProps {
  sectionName: SN;
  dbId: string;
}

export class DbSectionBase<
  SN extends ServerSectionName
> extends DbSectionsBase {
  readonly sectionName: SN;
  readonly dbId: string;
  constructor({ sectionName, dbId, ...rest }: DbSectionProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
    this.dbId = dbId;
  }
  get dbInfo(): DbSectionInfo<SN> {
    return {
      sectionName: this.sectionName,
      dbId: this.dbId,
    };
  }
  get dbSectionProps(): DbSectionProps<SN> {
    return {
      ...this.dbSectionsProps,
      ...this.dbInfo,
    };
  }
}
