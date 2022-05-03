import { Response } from "express";
import {
  SectionPackDbRaw,
  StoredSectionPackInfo
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { SavableSectionName } from "../../../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { getUserById } from "./getUserById";

export type FindSectionPackProps<
  DN extends SavableSectionName = SavableSectionName
> = {
  userId: string;
  spInfo: StoredSectionPackInfo<DN>;
  res: Response;
};

export async function findSectionPack<
  DN extends SavableSectionName = SavableSectionName
>({
  userId,
  spInfo,
  res,
}: FindSectionPackProps<DN>): Promise<SectionPackDbRaw<DN> | undefined> {
  const { dbStoreName, dbId } = spInfo;
  const user = await getUserById({ userId, res });
  return (user[dbStoreName] as { dbId: string }[]).find(
    (sectionPack) => sectionPack.dbId === dbId
  ) as SectionPackDbRaw<DN>;
}
