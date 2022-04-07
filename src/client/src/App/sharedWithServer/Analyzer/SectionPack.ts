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
  addSection() {
    // takes a child section's OneHeadSectionNode
    // minus childDbIds
    // but it will need to be added to its parent
    // so also provide the parentInfo
  }
  addSectionPack() {
    // takes a descendant sectionPack
    // and merges it with this
  }
  // this is much easier.
  // and I think this is pretty much all I have to do.
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
