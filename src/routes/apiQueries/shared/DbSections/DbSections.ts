import { Response } from "express";
import { DbSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionPack/DbSectionInfo";
import { SimpleDbStoreName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionTypes/dbStoreNames";
import { resHandledError } from "../../../../middleware/error";
import { UserModel } from "../../../UserModel";
import { DbSectionsBase } from "./Bases/DbSectionsBase";
import { DbSection } from "./DbSection";

interface InitProps {
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
  static async init({ userId, res }: InitProps) {
    const dbSections = await UserModel.findById(
      userId,
      undefined,
      queryOptions
    );
    if (dbSections) return new DbSections({ dbSections, res });
    else throw new UserNotFoundError("User not found.");
  }
  static async initOrSend404(props: InitProps) {
    try {
      return await this.init(props);
    } catch (ex) {
      if (ex instanceof UserNotFoundError) {
        throw resHandledError(props.res, 404, "You are not logged in.");
      }
    }
  }
}
