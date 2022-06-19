import { SimpleDbStoreName } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionTypes/dbStoreNames";
import { DbSectionsBase, DbSectionsProps } from "./DbSectionsBase";

interface DbSectionProps<SN extends SimpleDbStoreName> extends DbSectionsProps {
  sectionName: SN;
  dbId: string;
}

export class DbSectionBase<
  SN extends SimpleDbStoreName
> extends DbSectionsBase {
  readonly sectionName: SN;
  readonly dbId: string;
  constructor({ sectionName, dbId, ...rest }: DbSectionProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
    this.dbId = dbId;
  }
}
