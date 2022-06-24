import { DbVarbs } from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { SectionPackDbRaw } from "../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { ServerSectionName } from "./ServerSectionName";

export type UserDbRaw = {
  [SN in ServerSectionName]: SectionPackDbRaw<SN>[];
};

export function initDbSectionPack<SN extends SectionName>(
  sectionName: SN,
  fullDbVarbs?: DbVarbs
): SectionPackDbRaw<SN> {
  const sectionPack = SectionPack.init({
    sectionName,
    dbVarbs: fullDbVarbs,
  });
  return Obj.strictPick(sectionPack, ["dbId", "rawSections"]);
}
