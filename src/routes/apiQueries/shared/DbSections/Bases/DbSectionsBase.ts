import { Response } from "express";
import { Document } from "mongoose";
import { UserDbRaw } from "../../../../ServerUser";

interface DbSectionsCore extends UserDbRaw, Document<any, any> {}
export type DbSectionsProps = {
  dbSections: DbSectionsCore;
  res: Response;
};

export class DbSectionsBase {
  readonly dbSections: DbSectionsCore;
  readonly res: Response;
  constructor({ dbSections, res }: DbSectionsProps) {
    this.dbSections = dbSections;

    this.res = res;
  }
  get dbSectionsProps(): DbSectionsProps {
    return {
      dbSections: this.dbSections,
      res: this.res,
    };
  }
}
