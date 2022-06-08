import { z } from "zod";
import {
  RawSection,
  RawSections,
  zRawSections,
} from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import {
  SectionPackDbRaw,
  SectionPackRaw,
  ServerSectionPack,
} from "../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { SelfOrDescendantName } from "../client/src/App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { zodSchema } from "../client/src/App/sharedWithServer/utils/zod";

export class SectionPackDb<SN extends SectionName> {
  constructor(readonly core: SectionPackDbRaw<SN> & { sectionName: SN }) {}
  get sectionName() {
    return this.core.sectionName;
  }
  get dbId() {
    return this.core.dbId;
  }
  rawSectionArr<SDN extends SelfOrDescendantName<SN, "db">>(
    sectionName: SDN
  ): RawSection<SDN>[] {
    return this.core.rawSections[
      sectionName as keyof RawSections<SN>
    ] as any as RawSection<SDN>[];
  }
  headSection(): RawSection<SN> {
    return this.firstSection(this.sectionName);
  }
  firstSection<SDN extends SelfOrDescendantName<SN, "db">>(
    sectionName: SDN
  ): RawSection<SDN> {
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
  toFeSectionPack(): SectionPackRaw<SN> {
    return { ...this.core, contextName: "fe" } as Record<
      keyof SectionPackRaw<SN>,
      any
    > as SectionPackRaw<SN>;
  }
  static serverToDbRaw(
    sectionPack: ServerSectionPack
  ): SectionPackDbRaw<SavableSectionName> {
    return Obj.strictPick(sectionPack, ["dbId", "rawSections"]);
  }
  static rawDbToServer({
    sectionPackDb,
    dbStoreName,
  }: RawDbToServerProps): ServerSectionPack {
    return { ...sectionPackDb, sectionName: dbStoreName };
  }
}

type RawDbToServerProps = {
  sectionPackDb: SectionPackDbRaw;
  dbStoreName: SavableSectionName;
};

const zDbSectionPackFrame: Record<keyof SectionPackDbRaw, any> = {
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
const zDbSectionPack = z.object(zDbSectionPackFrame);
export const zDbSectionPackArr = z.array(zDbSectionPack);
