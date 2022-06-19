import { Response } from "express";
import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionPack/DbSectionInfo";
import { SimpleDbStoreName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionTypes/dbStoreNames";
import { ResStatusError } from "../../../../resErrorUtils";
import { UserModel } from "../../../UserModel";
import { DbSectionsBase } from "./Bases/DbSectionsBase";
import { DbSection } from "./DbSection";

export interface DbSectionsInitProps {
  res: Response;
  userId: string;
}

const queryOptions = {
  new: true,
  lean: true,
  useFindAndModify: false,
} as const;

export class UserNotFoundError extends Error {}
export class DbSections extends DbSectionsBase {
  section<SN extends SimpleDbStoreName>(
    dbInfo: DbSectionInfo<SN>
  ): DbSection<SN> {
    return new DbSection({
      ...this.dbSectionsProps,
      ...dbInfo,
    });
  }
  static async init({ userId, res }: DbSectionsInitProps): Promise<DbSections> {
    const dbSections = await UserModel.findById(
      userId,
      undefined,
      queryOptions
    );
    if (dbSections) return new DbSections({ dbSections, res });
    else
      throw new ResStatusError({
        errorMessage: "User not found.",
        resMessage: "Could not access user account.",
        status: 400,
      });
  }
}
