import { z } from "zod";
import {
  SectionPackDbRaw,
  SectionPackRaw,
  ServerSectionPack,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  RawSection,
  zRawSections,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw/RawSection";
import { InEntityVarbInfo } from "../../../client/src/App/sharedWithServer/SectionMetas/baseSections/baseValues/entities";
import { DbStoreNameNext } from "../../../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { SelfOrDescendantName } from "../../../client/src/App/sharedWithServer/SectionMetas/relSectionTypes/ChildTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../../../client/src/App/sharedWithServer/SectionMetas/SectionName";
import { Obj } from "../../../client/src/App/sharedWithServer/utils/Obj";
import { zodSchema } from "../../../client/src/App/sharedWithServer/utils/zod";

export class SectionPackDb<SN extends SectionName> {
  constructor(readonly core: SectionPackDbRaw<SN> & { sectionName: SN }) {}
  get sectionName() {
    return this.core.sectionName;
  }
  get dbId() {
    return this.core.dbId;
  }
  value(info: InEntityVarbInfo) {}
  rawSectionArr<SDN extends SelfOrDescendantName<SN, "db">>(
    sectionName: SDN
  ): RawSection<"db", SDN>[] {
    return this.core.rawSections[sectionName] as RawSection<"db", SDN>[];
  }
  headSection(): RawSection<"db", SN> {
    return this.firstSection(this.sectionName);
  }
  firstSection<SDN extends SelfOrDescendantName<SN, "db">>(
    sectionName: SDN
  ): RawSection<"db", SDN> {
    const rawSection = this.rawSectionArr(sectionName)[0];
    if (rawSection) return rawSection;
    else
      throw new Error(
        `No raw section was found at this.core.rawSections[${sectionName}]`
      );
  }
  isSectionType<ST extends SectionNameType<"db">>(
    sectionType: ST
  ): this is SectionPackDb<SectionName<ST>> {
    if (sectionNameS.is(this.sectionName, sectionType)) return true;
    else return false;
  }
  toFeSectionPack(): SectionPackRaw<"fe", SN> {
    return { ...this.core, contextName: "fe" } as Record<
      keyof SectionPackRaw<"fe", SN>,
      any
    > as SectionPackRaw<"fe", SN>;
  }
  static serverToDbRaw(
    sectionPack: ServerSectionPack
  ): SectionPackDbRaw<DbStoreNameNext> {
    return Obj.strictPick(sectionPack, ["dbId", "rawSections"]);
  }
  static rawDbToServer({
    sectionPackDb,
    dbStoreName,
  }: RawDbToServerProps): ServerSectionPack {
    return { ...sectionPackDb, contextName: "db", sectionName: dbStoreName };
  }
}

type RawDbToServerProps = {
  sectionPackDb: SectionPackDbRaw;
  dbStoreName: DbStoreNameNext;
};

const zDbSectionPackFrame: Record<keyof SectionPackDbRaw, any> = {
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
const zDbSectionPack = z.object(zDbSectionPackFrame);
export const zDbSectionPackArr = z.array(zDbSectionPack);
