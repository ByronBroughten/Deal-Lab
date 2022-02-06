import { Response } from "express";
import { DbEntry } from "../../../sharedWithServer/Analyzer/DbEntry";
import { DbStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { UserModel } from "../shared/makeDbUser";

export async function getDbEntry(
  userId: string,
  dbStoreName: DbStoreName,
  dbId: string,
  res: Response
): Promise<DbEntry | undefined> {
  const user = await UserModel.findById(userId, undefined, {
    new: true,
    lean: true,
    useFindAndModify: false,
  });
  if (!user) {
    res.status(404).send("You are not properly logged in.");
    return;
  }
  return user[dbStoreName].find((entry) => entry.dbId === dbId);
}
