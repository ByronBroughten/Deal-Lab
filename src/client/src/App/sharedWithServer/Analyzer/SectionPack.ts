import { omit } from "lodash";
import { sectionMetas } from "./SectionMetas";
import {
  NameToNameWithSameChildren,
  OneChildIdArrs,
} from "./SectionMetas/relNameArrs/ChildTypes";
import { ContextName } from "./SectionMetas/relSections/baseSections";
import { Id } from "./SectionMetas/relSections/baseSections/id";
import {
  SectionNam,
  SectionName,
  SectionNameType,
} from "./SectionMetas/SectionName";
import {
  SectionPackDbRaw,
  SectionPackRaw,
  zRawSectionPack,
} from "./SectionPackRaw";
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
  feToDbRaw<NextSN extends NameToNameWithSameChildren<SN, "fe", "db">>(
    nextSectionName: NextSN
  ): SectionPackDbRaw<NextSN> {
    const { sectionName } = this;
    return {
      dbId: this.core.dbId,
      rawSections: {
        ...omit(this.core.rawSections, [sectionName]),
        [nextSectionName]: this.core.rawSections[sectionName],
      },
    } as Record<
      keyof SectionPackDbRaw<NextSN>,
      any
    > as SectionPackDbRaw<NextSN>;
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
      ("fe" && SectionNam.is(value.sectionName, sectionType ?? "all"))
    ) {
      return true;
    } else return false;
  }
}

type IsRawProps<
  ST extends SectionNameType = "all",
  CN extends ContextName = ContextName
> = {
  sectionType?: ST;
  contextName?: CN;
};
