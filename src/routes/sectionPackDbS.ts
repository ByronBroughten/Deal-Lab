import { z } from "zod";
import { zRawSections } from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import {
  SectionPackDbRaw,
  ServerSectionPack,
} from "../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { DbSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { zodSchema } from "../client/src/App/sharedWithServer/utils/zod";

export const sectionPackDbS = {
  serverToDbRaw(
    sectionPack: ServerSectionPack
  ): SectionPackDbRaw<DbSectionName> {
    return Obj.strictPick(sectionPack, ["dbId", "rawSections"]);
  },
  rawDbToServer({
    sectionPackDb,
    sectionName,
  }: RawDbToServerProps): ServerSectionPack {
    return { ...sectionPackDb, sectionName };
  },
} as const;

type RawDbToServerProps = {
  sectionPackDb: SectionPackDbRaw;
  sectionName: DbSectionName;
};

const zDbSectionPackFrame: Record<keyof SectionPackDbRaw, any> = {
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
const zDbSectionPack = z.object(zDbSectionPackFrame);
export const zDbSectionPackArr = z.array(zDbSectionPack);
