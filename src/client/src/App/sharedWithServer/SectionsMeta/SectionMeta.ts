import { DbVarbs } from "../SectionPack/RawSection";
import { Obj } from "../utils/Obj";
import { SimpleSectionName } from "./baseSections";
import { relSections } from "./relSections";
import {
  ChildIdArrsNarrow,
  ChildIdArrsWide,
  ChildName,
} from "./relSectionTypes/ChildTypes";
import {
  CorePropName,
  sectionMetasCore,
  SectionsMetaCore,
} from "./sectionMetasCore";
import { VarbMetas } from "./VarbMetas";

type SectionMetaExtra = {
  varbMetas: VarbMetas;
};
export interface SectionMetaProps<SN extends SimpleSectionName>
  extends SectionMetaExtra {
  sectionName: SN;
}

type CoreProp<
  SN extends SimpleSectionName,
  PN extends CorePropName
> = SectionsMetaCore[SN][PN];

type CorePropNoNull<
  SN extends SimpleSectionName,
  PN extends CorePropName
> = Exclude<CoreProp<SN, PN>, null>;

export class SectionMeta<SN extends SimpleSectionName> {
  constructor(readonly props: SectionMetaProps<SN>) {}
  get sectionName(): SN {
    return this.props.sectionName;
  }
  get core() {
    return sectionMetasCore[this.sectionName];
  }
  get rowIndexName(): CorePropNoNull<SN, "rowIndexName"> {
    return this.propNoNull("rowIndexName");
  }
  get tableSourceName(): CorePropNoNull<SN, "tableSourceName"> {
    return this.propNoNull("tableSourceName");
  }
  get tableStoreName(): CorePropNoNull<SN, "tableStoreName"> {
    return this.propNoNull("tableStoreName");
  }
  get displayName(): string {
    return this.prop("displayName");
  }
  propNoNull<PN extends CorePropName>(propName: PN): CorePropNoNull<SN, PN> {
    const prop = this.core[propName];
    if (prop === null) {
      throw new Error(
        `Prop at relSections.${this.sectionName}.${propName} is null`
      );
    }
    return prop as CorePropNoNull<SN, PN>;
  }
  prop<PN extends CorePropName>(propName: PN): CoreProp<SN, PN> {
    return this.core[propName];
  }
  get parentNames(): CoreProp<SN, "parentNames"> {
    return this.prop("parentNames");
  }
  get childNames(): ChildName<SN>[] {
    return this.prop("childNames") as string[] as ChildName<SN>[];
  }
  get alwaysOne(): boolean {
    return this.prop("alwaysOne");
  }
  get varbMetas(): VarbMetas {
    return this.props.varbMetas;
  }
  get varbNames(): string[] {
    return this.varbMetas.varbNames;
  }
  isChildName(value: any): value is ChildName<SN> {
    return (this.childNames as string[]).includes(value);
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
    const varbMetasCore = this.varbMetas.getCore();
    for (const [varbName, varbMeta] of Obj.entries(varbMetasCore)) {
      defaultDbVarbs[varbName] = varbMeta.get("initValue");
    }
    return defaultDbVarbs;
  }
  depreciatingUpdateVarbMetas(nextVarbMetas: VarbMetas) {
    const nextCore = { ...this.props };
    nextCore.varbMetas = nextVarbMetas;
    return new SectionMeta(nextCore);
  }
  static init<SN extends SimpleSectionName>(sectionName: SN): SectionMeta<SN> {
    const { relVarbs } = relSections[sectionName];
    return new SectionMeta({
      sectionName,
      varbMetas: VarbMetas.initFromRelVarbs(relVarbs, sectionName),
    });
  }
}
