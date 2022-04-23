import { omit } from "lodash";
import { sectionMetas } from "../SectionMetas";
import { ContextName } from "../SectionMetas/baseSections";
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

export type OneHeadSectionNode<
  SN extends SectionName,
  CN extends ContextName
> = {
  sectionName: SN;
  contextName: CN;
  dbId?: string;
  childDbIds?: Partial<OneChildIdArrs<SN, CN>>;
  dbVarbs?: Partial<DbVarbs>;
};
export class SectionPack<SN extends SectionName, CN extends ContextName> {
  constructor(readonly core: SectionPackRaw<CN, SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  feToServerRaw<NextSN extends FeToDbNameWithSameChildren<SN>>(
    nextSectionName: NextSN
  ): SectionPackRaw<"db", NextSN> {
    const { sectionName } = this;
    return {
      contextName: "db",
      sectionName: nextSectionName,
      dbId: this.core.dbId,
      rawSections: {
        ...omit(this.core.rawSections, [sectionName]),
        [nextSectionName]: this.core.rawSections[sectionName],
      },
    } as Record<keyof SectionPackRaw<"db", NextSN>, any> as SectionPackRaw<
      "db",
      NextSN
    >;
  }
  static init<SN extends SectionName, CN extends ContextName>({
    sectionName,
    contextName,
    childDbIds,
    dbVarbs,
    dbId = Id.make(),
  }: OneHeadSectionNode<SN, CN>): SectionPackRaw<CN, SN> {
    const sectionMeta = sectionMetas.section(sectionName, contextName);
    return {
      sectionName,
      contextName,
      dbId,
      rawSections: {
        ...SectionPack.emptyRawSections(sectionName, contextName),
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
  static emptyRawSections<SN extends SectionName, CN extends ContextName>(
    sectionName: SN,
    contextName: CN
  ): RawSections<SN, CN> {
    return sectionMetas
      .selfAndDescendantNames(sectionName, contextName)
      .reduce((rawSections, name) => {
        rawSections[name] = [];
        return rawSections;
      }, {} as RawSections<SN, CN>);
  }
  static isRaw<
    ST extends SectionNameType = "all",
    CN extends ContextName = "fe"
  >(
    value: any,
    { contextName, sectionType }: IsRawProps<ST, CN> = {}
  ): value is SectionPackRaw<CN, SectionName<ST>> {
    if (
      (zRawSectionPack.safeParse(value).success &&
        value.contextName === contextName) ??
      ("fe" && sectionNameS.is(value.sectionName, sectionType ?? "all"))
    ) {
      return true;
    } else return false;
  }
  static isServer(value: any) {
    return SectionPack.isRaw(value, {
      contextName: "db",
      sectionType: "dbStore",
    });
  }
}

type IsRawProps<
  ST extends SectionNameType = "all",
  CN extends ContextName = ContextName
> = {
  sectionType?: ST;
  contextName?: CN;
};

export type StoredSectionPackInfo<
  SN extends SectionName<"dbStore"> = SectionName<"dbStore">
> = {
  dbStoreName: SN;
  dbId: string;
};
