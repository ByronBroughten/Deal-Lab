import { DbVarbs } from "../Analyzer/DbEntry";
import { Obj } from "../utils/Obj";
import {
  baseSections,
  BaseSections,
  ContextName,
  SimpleSectionName,
} from "./baseSections";
import { RelName } from "./relNameArrs";
import { SourceTables, sourceTables } from "./relNameArrs/tableSourceArrs";
import { relSections, RelSections } from "./relSections";
import { ChildIdArrs, ChildName } from "./relSectionTypes/ChildTypes";
import {
  sectionParentNames,
  SectionToParentArrs,
} from "./relSectionTypes/ParentTypes";
import { sectionNameS } from "./SectionName";
import { VarbMetas } from "./VarbMetas";

type SectionMetaExtra<CN extends ContextName, SN extends SimpleSectionName> = {
  varbMetas: VarbMetas;
  parentNames: SectionToParentArrs<CN>[SN];
  tableSourceName: SourceTableParams[SN];
};

type SourceTableParams = {
  [SN in SimpleSectionName]: SN extends RelName<"tableSource">
    ? SourceTables[SN]
    : null;
};
function getSourceTableParam<SN extends SimpleSectionName>(
  sectionName: SN
): SourceTableParams[SN] {
  if (sectionNameS.is(sectionName, "tableSource")) {
    return sourceTables[sectionName] as SourceTableParams[SN];
  } else return null as SourceTableParams[SN];
}

function getParentNamesParam<
  CN extends ContextName,
  SN extends SimpleSectionName
>(contextName: CN, sectionName: SN): SectionToParentArrs<CN>[SN] {
  return sectionParentNames[contextName][sectionName] as any;
}

export type SectionMetaCore<
  CN extends ContextName,
  SN extends SimpleSectionName
> = RelSections[CN][SN & keyof RelSections[CN]] &
  BaseSections[CN][SN] &
  SectionMetaExtra<CN, SN>;

export class SectionMeta<CN extends ContextName, SN extends SimpleSectionName> {
  constructor(readonly core: SectionMetaCore<CN, SN>) {}
  get<PN extends keyof SectionMetaCore<CN, SN>>(
    propName: PN
  ): SectionMetaCore<CN, SN>[PN] {
    return this.core[propName];
  }
  get props() {
    return this.core;
  }
  emptyChildIds(): ChildIdArrs<SN, CN> {
    return (this.get("childNames") as ChildName<SN, CN>[]).reduce(
      (childIds, childName) => {
        childIds[childName] = [];
        return childIds;
      },
      {} as ChildIdArrs<SN, CN>
    );
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
  static init<CN extends ContextName, SN extends SimpleSectionName>(
    contextName: CN,
    sectionName: SN
  ): SectionMeta<CN, SN> {
    const relSection = relSections[contextName][sectionName];
    const baseSection = baseSections[contextName][sectionName];
    return new SectionMeta({
      ...relSection,
      ...baseSection,
      varbMetas: VarbMetas.initFromRelVarbs(relSection.relVarbs, sectionName),
      parentNames: getParentNamesParam(contextName, sectionName),
      tableSourceName: getSourceTableParam(sectionName),
    });
  }
}
