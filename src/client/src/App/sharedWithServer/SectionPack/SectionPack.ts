import { sectionsMeta } from "../SectionsMeta";
import { Id } from "../SectionsMeta/baseSections/id";
import { ChildIdArrsWide } from "../SectionsMeta/relSectionTypes/ChildTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionName";
import { DbVarbs, RawSections } from "./RawSection";
import { SectionPackRaw, zRawSectionPack } from "./SectionPackRaw";

export type OneHeadSectionNode<SN extends SectionName> = {
  sectionName: SN;
  dbId?: string;
  childDbIds?: Partial<ChildIdArrsWide<SN>>;
  dbVarbs?: Partial<DbVarbs>;
};
export class SectionPack<SN extends SectionName> {
  constructor(readonly core: SectionPackRaw<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  static init<SN extends SectionName>({
    sectionName,
    childDbIds,
    dbVarbs,
    dbId = Id.make(),
  }: OneHeadSectionNode<SN>): SectionPackRaw<SN> {
    const sectionMeta = sectionsMeta.section(sectionName);
    return {
      sectionName,
      dbId,
      rawSections: {
        ...SectionPack.emptyRawSections(sectionName),
        [sectionName]: [
          {
            dbId,
            childDbIds: {
              ...sectionMeta.emptyChildIdsWide(),
              ...childDbIds,
            },
            dbVarbs: {
              ...sectionMeta.defaultDbVarbs(),
              ...dbVarbs,
            },
          },
        ],
      },
    };
  }
  static emptyRawSections<SN extends SectionName>(
    sectionName: SN
  ): RawSections<SN> {
    return sectionsMeta
      .selfAndDescendantNames(sectionName)
      .reduce((rawSections, name) => {
        rawSections[name] = [];
        return rawSections;
      }, {} as RawSections<SN>);
  }
  static isOfSectionName<SN extends SectionName>(
    value: any,
    sectionName: SN
  ): value is SectionPackRaw<SN> {
    if (
      zRawSectionPack.safeParse(value).success &&
      value.sectionName === sectionName
    ) {
      return true;
    } else return false;
  }
  static isRaw<ST extends SectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is SectionPackRaw<SectionName<ST>> {
    if (
      zRawSectionPack.safeParse(value).success &&
      sectionNameS.is(value.sectionName, sectionType ?? "all")
    ) {
      return true;
    } else return false;
  }
  static isServer(value: any) {
    return SectionPack.isRaw(value, "dbStoreNext");
  }
}
