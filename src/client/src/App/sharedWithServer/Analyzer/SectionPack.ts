import { RawSectionPack } from "./RawSectionPack";
import { sectionMetas } from "./SectionMetas";
import { OneChildIdArrs } from "./SectionMetas/relNameArrs/ChildTypes";
import { ContextName } from "./SectionMetas/relSections/baseSections";
import { Id } from "./SectionMetas/relSections/baseSections/id";
import { SectionName } from "./SectionMetas/SectionName";
import { DbVarbs, RawSections } from "./SectionPack/RawSection";

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
  constructor(readonly core: RawSectionPack<SN, CN>) {}
  static init<SN extends SectionName, CN extends ContextName>({
    sectionName,
    contextName,
    childDbIds,
    dbVarbs,
    dbId = Id.make(),
  }: OneHeadSectionNode<SN, CN>): RawSectionPack<SN, CN> {
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
}
