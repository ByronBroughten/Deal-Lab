import { omit } from "lodash";
import { sectionMetas } from "../SectionMetas";
import { Id } from "../SectionMetas/baseSections/id";
import {
  FeToDbNameWithSameChildren,
  OneChildIdArrs,
} from "../SectionMetas/relSectionTypes/ChildTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionMetas/SectionName";
import { SectionPackRaw, zRawSectionPack } from "./SectionPackRaw";
import { DbVarbs, RawSections } from "./SectionPackRaw/RawSection";

export type OneHeadSectionNode<SN extends SectionName> = {
  sectionName: SN;
  dbId?: string;
  childDbIds?: Partial<OneChildIdArrs<SN>>;
  dbVarbs?: Partial<DbVarbs>;
};
export class SectionPack<SN extends SectionName> {
  constructor(readonly core: SectionPackRaw<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  feToServerRaw<NextSN extends FeToDbNameWithSameChildren<SN>>(
    nextSectionName: NextSN
  ): SectionPackRaw<NextSN> {
    const { sectionName } = this;
    return {
      sectionName: nextSectionName,
      dbId: this.core.dbId,
      rawSections: {
        ...omit(this.core.rawSections, [sectionName]),
        [nextSectionName]: this.core.rawSections[sectionName],
      },
    } as Record<keyof SectionPackRaw<NextSN>, any> as SectionPackRaw<NextSN>;
  }
  static init<SN extends SectionName>({
    sectionName,
    childDbIds,
    dbVarbs,
    dbId = Id.make(),
  }: OneHeadSectionNode<SN>): SectionPackRaw<SN> {
    const sectionMeta = sectionMetas.section(sectionName);
    return {
      sectionName,
      dbId,
      rawSections: {
        ...SectionPack.emptyRawSections(sectionName),
        [sectionName]: {
          dbId,
          childDbIds: {
            ...sectionMeta.emptyChildIds(),
            ...childDbIds,
          },
          dbVarbs: {
            ...sectionMeta.defaultDbVarbs(),
            ...dbVarbs,
          },
        },
      },
    };
  }
  static emptyRawSections<SN extends SectionName>(
    sectionName: SN
  ): RawSections<SN> {
    return sectionMetas
      .selfAndDescendantNames(sectionName)
      .reduce((rawSections, name) => {
        rawSections[name] = [];
        return rawSections;
      }, {} as RawSections<SN>);
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
