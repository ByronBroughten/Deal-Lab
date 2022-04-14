import { Response } from "express";
import { SectionName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { getUserById } from "./getUserById";

type SectionPackInfo<SN extends SectionName<"dbStore">> = {
  dbStoreName: SN;
  dbId: string;
};

export type FindSectionPackProps<SN extends SectionName<"dbStore">> = {
  userId: string;
  spInfo: SectionPackInfo<SN>;
  res: Response;
};

export async function findSectionPack<SN extends SectionName<"dbStore">>({
  userId,
  spInfo,
  res,
}: FindSectionPackProps<SN>) {
  const { dbStoreName, dbId } = spInfo;
  const user = await getUserById({ userId, res });
  return (user[dbStoreName] as { dbId: string }[]).find(
    (sectionPack) => sectionPack.dbId === dbId
  );
}
