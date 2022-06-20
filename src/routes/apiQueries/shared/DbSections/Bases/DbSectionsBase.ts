import { DbSectionsRaw } from "../DbSectionsQuerierTypes";

export type DbSectionsProps = {
  dbSectionsRaw: DbSectionsRaw;
};

export class DbSectionsBase {
  readonly dbSectionsRaw: DbSectionsRaw;
  constructor({ dbSectionsRaw }: DbSectionsProps) {
    this.dbSectionsRaw = dbSectionsRaw;
  }
  get dbSectionsProps(): DbSectionsProps {
    return { dbSectionsRaw: this.dbSectionsRaw };
  }
}
