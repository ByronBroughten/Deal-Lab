import { DbVarbs } from "../SectionPack/RawSection";
import { Obj } from "../utils/Obj";
import {
  baseSections,
  BaseSections,
  ContextName,
  SimpleSectionName,
} from "./baseSections";
import {
  allTableSourceParams,
  TableSourceParams,
} from "./relNameArrs/tableStoreArrs";
import { relSections, RelSections } from "./relSections";
import {
  ChildIdArrsNarrow,
  ChildIdArrsWide,
  ChildName,
} from "./relSectionTypes/ChildTypes";
import {
  sectionParentNames,
  SectionToParentArrs,
} from "./relSectionTypes/ParentTypes";
import { VarbMetas } from "./VarbMetas";

type SectionMetaExtra<CN extends ContextName, SN extends SimpleSectionName> = {
  varbMetas: VarbMetas;
  parentNames: SectionToParentArrs<CN>[SN];
  tableSource: TableSourceParams[SN];
};

export type SectionMetaCore<SN extends SimpleSectionName> =
  RelSections["fe"][SN] & BaseSections["fe"][SN] & SectionMetaExtra<"fe", SN>;

export class SectionMeta<SN extends SimpleSectionName> {
  constructor(readonly core: SectionMetaCore<SN>) {}
  get<PN extends keyof SectionMetaCore<SN>>(
    propName: PN
  ): SectionMetaCore<SN>[PN] {
    return this.core[propName];
  }
  get childNames(): ChildName<SN>[] {
    return this.core.childNames as ChildName<SN>[];
  }
  get varbNames(): string[] {
    return this.core.varbMetas.varbNames;
  }
  get varbsMeta(): VarbMetas {
    return this.core.varbMetas;
  }
  isChildName(value: any): value is ChildName<SN> {
    return (this.childNames as string[]).includes(value);
  }
  get props() {
    return this.core;
  }
  emptyChildIdsWide(): ChildIdArrsWide<SN> {
    return this.childNames.reduce((childIds, childName) => {
      childIds[childName] = [];
      return childIds;
    }, {} as ChildIdArrsWide<SN>);
  }
  emptyChildIdsNarrow(): ChildIdArrsNarrow<SN> {
    return this.emptyChildIdsWide() as any as ChildIdArrsNarrow<SN>;
  }
  defaultDbVarbs(): DbVarbs {
    const defaultDbVarbs: DbVarbs = {};
    const varbMetasCore = this.get("varbMetas").getCore();
    for (const [varbName, varbMeta] of Obj.entries(varbMetasCore)) {
      defaultDbVarbs[varbName] = varbMeta.get("dbInitValue");
    }
    return defaultDbVarbs;
  }
  depreciatingUpdateVarbMetas(nextVarbMetas: VarbMetas) {
    const nextCore = { ...this.core };
    nextCore.varbMetas = nextVarbMetas;
    return new SectionMeta(nextCore);
  }
  static init<SN extends SimpleSectionName>(sectionName: SN): SectionMeta<SN> {
    const relSection = relSections["fe"][sectionName];
    const baseSection = baseSections["fe"][sectionName];
    return new SectionMeta({
      ...relSection,
      ...baseSection,
      varbMetas: VarbMetas.initFromRelVarbs(relSection.relVarbs, sectionName),
      parentNames: this.getParentNamesParam(sectionName),
      tableSource: this.getTableSourceParam(sectionName),
    });
  }
  private static getParentNamesParam<SN extends SimpleSectionName>(
    sectionName: SN
  ): SectionToParentArrs<"fe">[SN] {
    return sectionParentNames["fe"][sectionName] as any;
  }
  private static getTableSourceParam<SN extends SimpleSectionName>(
    sectionName: SN
  ): TableSourceParams[SN] {
    return allTableSourceParams[sectionName];
  }
}
