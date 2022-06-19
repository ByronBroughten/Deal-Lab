import { Response } from "express";
import {
  SectionPackDbRaw,
  StoredSectionPackInfo,
} from "../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../../../client/src/App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { getUserSectionsById } from "./getUserDbSectionsById";

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
  const dbSections = await getUserSectionsById({ userId, res });
  return (dbSections[dbStoreName] as { dbId: string }[]).find(
    (sectionPack) => sectionPack.dbId === dbId
  ) as SectionPackDbRaw<DN>;
}
